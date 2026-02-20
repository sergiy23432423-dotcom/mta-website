const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const db = require('./database');
const mtaDb = require('./mta_database');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Registration Endpoint
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Всі поля обов\'язкові' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    db.run(sql, [username, email, hashedPassword], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                return res.status(400).json({ error: 'Користувач або Email вже існує' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Реєстрація успішна!', userId: this.lastID });
    });
});

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ error: 'Всі поля обов\'язкові' });
    }

    const sql = `SELECT * FROM users WHERE username = ? OR email = ?`;
    db.get(sql, [login, login], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(400).json({ error: 'Користувача не знайдено' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ error: 'Невірний пароль' });
        }

        res.status(200).json({
            message: 'Вхід успішний!',
            user: { id: user.id, username: user.username, email: user.email }
        });
    });
});

// MTA Server Cabinet Login
app.post('/api/mta/login', async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ error: 'Введіть логін/email та пароль' });
    }

    try {
        // Запит до БД МТА серверу - перевіряємо логін і email
        const [users] = await mtaDb.query('SELECT * FROM ugta_players WHERE login = ? OR email = ?', [login, login]);

        if (users.length === 0) {
            return res.status(400).json({ error: 'Акаунт не знайдено' });
        }

        const user = users[0];

        // Перевірка пароля (plain text в вашій БД)
        if (user.password !== password) {
            return res.status(401).json({ error: 'Невірний пароль' });
        }

        // Парсимо permanent_data для отримання банківських даних
        let bankMoney = 0;
        try {
            const permanentData = JSON.parse(user.permanent_data);
            if (permanentData && permanentData[0] && permanentData[0].bank_data) {
                bankMoney = permanentData[0].bank_data.money || 0;
            }
        } catch (e) {
            console.log('Не вдалося розпарсити permanent_data');
        }

        // Рахуємо години (playing_time в секундах)
        const hours = Math.floor((user.playing_time || 0) / 3600);

        // Визначаємо фракцію
        const factionNames = {
            0: 'Відсутня',
            1: 'Поліція',
            2: 'Медики',
            3: 'Армія',
            4: 'ФСБ',
            5: 'Уряд',
            6: 'Мафія',
            7: 'Банда',
            8: 'Якудза'
        };
        const factionName = factionNames[user.faction_id] || 'Відсутня';

        res.status(200).json({
            message: 'Вхід в кабінет успішний!',
            user: {
                username: user.nickname,
                money: user.money || 0,           // Готівка в кишені
                bank: bankMoney,                   // Гроші в банку
                level: user.level || 1,            // Рівень гравця
                hours: hours,                      // Години в грі
                donate: user.donate || 0,          // Донат валюта
                faction: factionName,              // Назва фракції
                skin: user.skin || 0               // ID скіна
            }
        });
    } catch (err) {
        console.error('MTA DB ERROR DETAILS:', {
            code: err.code,
            errno: err.errno,
            sqlState: err.sqlState,
            message: err.message
        });
        res.status(500).json({ error: 'Помилка підключення до бази даних сервера: ' + err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

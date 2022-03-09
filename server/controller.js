const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

const userId = 4 
 const clientId = 3

module.exports = {
    getUserInfo: (req, res) => {
        sequelize.query(`
        SELECT * FROM cc_clients AS c
        JOIN cc_users u ON c.user_id = u.user_id
        WHERE u.user_id = ${userId};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
        
    },

    updateUserInfo: (req, res) => {
        let {
            firstNmae,
            lastName,
            phoneNumber,
            email,
            address, 
            city,
            state,
            zipcode
        } = req.body

        sequelize.query(`
            UPDATE cc_users
            SET first_name = '${firstName}',
            last_Name = '${lastName}',
            email = '${email}',
            phone_number = '${phoneNumber}',
            WHERE user_id = ${userId};
            
            UPDATE cc_clients
            SET address = '${address}',
            state = '${state}',
            city = '${city}',
            zip_code = ${zipCode}
            WHERE user_id = ${userId};
            `)

            .then(() => res.sendStatus(200))
            .catch(err => console.log(err))
    },


    getUserAppt: (req, res) => {
        sequelize.query(`
        SELECT * FROM cc_appoinments
        WHERE client_id = ${clientId}
        ORDER BY date DESC;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    requestAppoinment: (req, res) => {
        let {date, service} = req.body

        sequelize.query(`
        INSERT INTO cc_appointments (client_id, date, service_type, notes, approved, completed)
        VALUES (${clientId}, '${date}', '${service}', '', false)
        RETURNING *;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    }


}
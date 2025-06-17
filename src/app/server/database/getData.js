import createConnection from "./mysql"

const getTest = async () => {
    try {
        const connection = await createConnection();
        const db = await connection.query(`SELECT * FROM test`);
        console.log(db)
    } catch (err){
        console.log(err)
    }
}

export { getTest }
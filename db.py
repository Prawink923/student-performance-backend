import mysql.connector

def get_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="1234",          # put your MySQL password if you have one
        database="studentdb"
    )
    return connection

import sqlite3


def get_db_connection():
    conn = sqlite3.connect('schedule.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            color TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()



# If you want to run the database on your local machine,
# uncomment the code below and comment out the above code.

# def get_db_connection():
#     try:
#         conn = psycopg2.connect(
#             database="scheduler_database",
#             user="postgres",
#             password="1234",
#             host="127.0.0.1",
#             port="5432",
#         )
#         print("Successfully connected")
#         return conn
#     except psycopg2.Error as e:
#         print(f"Error connecting: {e}")
#         return None

# def init_db():
#     conn = get_db_connection()
#     if conn is None:
#         print("Couldn't initialize db because connection failed.")
#         return

#     try:
#         with conn.cursor() as cur:
#             cur.execute("""
#             CREATE TABLE IF NOT EXISTS tasks (
#                 id SERIAL PRIMARY KEY,
#                 name TEXT NOT NULL,
#                 start_time TEXT NOT NULL,
#                 end_time TEXT NOT NULL,
#                 color TEXT NOT NULL
#             );
#             """)
#             conn.commit()
#             print("Successfull")
#     except psycopg2.Error as e:
#         print(f"Error initializing table: {e}")
#     finally:
#         if conn:
#             conn.close()
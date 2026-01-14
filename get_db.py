import psycopg2
import os


def get_db_connection():
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        raise ValueError("DATABASE_URL is not set. Check your .env file!")

    conn = psycopg2.connect(database_url)
    return conn



def init_db():
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                color TEXT NOT NULL
            );
            """)
            conn.commit()
            print("Table initialization successful")
        conn.close()
    except Exception as e:
        print(f"------------\nDB INIT FAILED: {e}\n------------")



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
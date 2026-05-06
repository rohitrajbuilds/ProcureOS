from app.database.init_db import initialize_database
from app.rag.store import rag_store


if __name__ == "__main__":
    initialize_database()
    rag_store.build_index()
    print("Seed completed successfully.")

from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings
import os

Base = declarative_base()

# Determine which database to use
DATABASE_URL = None
DB_TYPE = None


def test_postgresql_connection(postgresql_url: str) -> bool:
    """Test if PostgreSQL connection is available"""
    try:
        test_engine = create_engine(postgresql_url, pool_pre_ping=True, connect_args={"connect_timeout": 2})
        with test_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        test_engine.dispose()
        return True
    except Exception as e:
        print(f"PostgreSQL connection test failed: {e}")
        return False


def get_database_url():
    """Get the appropriate database URL, checking PostgreSQL first, then falling back to SQLite"""
    global DATABASE_URL, DB_TYPE
    
    if DATABASE_URL is not None:
        return DATABASE_URL, DB_TYPE
    
    # Try PostgreSQL first
    if test_postgresql_connection(settings.POSTGRESQL_URL):
        DATABASE_URL = settings.POSTGRESQL_URL
        DB_TYPE = "postgresql"
        print("✓ Connected to PostgreSQL database")
        return DATABASE_URL, DB_TYPE
    
    # Fallback to SQLite
    sqlite_path = settings.SQLITE_DB_PATH
    # Ensure the directory exists
    db_dir = os.path.dirname(sqlite_path) if os.path.dirname(sqlite_path) else "."
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)
    
    DATABASE_URL = f"sqlite:///{sqlite_path}"
    DB_TYPE = "sqlite"
    print(f"✓ Using SQLite database: {sqlite_path}")
    return DATABASE_URL, DB_TYPE


# Initialize database URL
database_url, db_type = get_database_url()

# Export db_type for use in models
__all__ = ['Base', 'engine', 'SessionLocal', 'get_db', 'db_type']

# Create engine with appropriate configuration
if db_type == "sqlite":
    # SQLite-specific configuration
    engine = create_engine(
        database_url,
        connect_args={"check_same_thread": False},  # Required for SQLite with multiple threads
        echo=settings.DEBUG
    )
else:
    # PostgreSQL configuration
    engine = create_engine(
        database_url,
        pool_pre_ping=True,
        echo=settings.DEBUG
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


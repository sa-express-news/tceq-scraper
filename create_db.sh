psql postgres -c "CREATE DATABASE tceq";
psql tceq < tceq.sql
psql postgres -c "CREATE DATABASE tceq_test";
psql tceq_test < tceq.sql
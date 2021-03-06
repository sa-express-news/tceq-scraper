# SAEN TCEQ Complaint Scraper #

This code scrapes citizen complaints on [the Texas Commission on Environmental Quality's website](http://www2.tceq.texas.gov/oce/waci/index.cfm) daily, adds them to a PostgreSQL database and emails them out to addresses of your choosing.

## Getting Started ##

### Building the Database ###

This application uses a PostgreSQL database to store complaints. Running the application test suite also requires you to set up a separate test database. This repo contains a shell script to populate the databases. Here's how to get everything working:

1. If your shell user doesn't yet have a PostgreSQL role, get to the `psql` command prompt and create one for it:

`su - postgres` 
`psql`
(or `sudo -u postgres psql postgres`)
`CREATE ROLE yourname WITH CREATEDB LOGIN ENCRYPTED PASSWORD 'goodpassword';`
`\q`

2. Navigate to this project's root directory and run the `create_db.sh` script:

`./create_db.sh`

You should see the results of a SQL database creation script. (You can ignore the warnings about privileges for "public").

### Environment Variables ###

This scraper relies on environment variables to operate the database, test suite and other utilities like the ability to email new complaints out once per day. To set up the environment variables on your machine, create a `.env` file in the project's root directory formatted like so:

```
HOST=your_database_host
PORT=your_database_port
DB=tceq
TEST_DB=tceq_test
DB_USER=your_db_user
PASSWORD=your_db_password
EMAIL_HOST=your_email_host
EMAIL_PORT=email_port
EMAIL_AUTH_USER=your_email_address
EMAIL_AUTH_PASS=your_email_password
EMAIL_SENDER=your_email_address
EMAIL_RECIPIENTS=recipient1@mail.com,recipient2@mail.com
```

The script expects to connect to an SMTP server (we use our organization Outlook one) to send the results of scrape jobs to other email recipients. The `EMAIL_RECIPIENTS` environment variable is a comma-separated list of those recipients.

### Automating Scrape Jobs ###

This repository contains a `daily.sh` script that will request all of the complaints for the day prior, add them to the `tceq` database and send them in an email to the addresses listed in the `EMAIL_RECIPIENTS` environment variable.

You can automate this script with a cron job; we recommend setting it for late at night as complaints can come in throughout the day (another reason we request for the day prior). Also keep in mind that complaints for a given date can get added days later; this daily scrape job will not pick them up.
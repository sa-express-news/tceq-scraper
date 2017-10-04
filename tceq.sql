--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.8
-- Dumped by pg_dump version 9.5.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: complaints; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE complaints (
    tracking_number integer NOT NULL,
    date_received date,
    number_complaining integer,
    status character varying,
    status_date date,
    nature character varying,
    frequency character varying,
    duration character varying,
    media character varying,
    program character varying,
    priority character varying,
    effect character varying,
    receiving_water character varying,
    regulated_entity character varying,
    county character varying,
    description character varying,
    comment character varying,
    action_taken character varying,
    url character varying
);


--
-- Data for Name: complaints; Type: TABLE DATA; Schema: public; Owner: -
--

COPY complaints (tracking_number, date_received, number_complaining, status, status_date, nature, frequency, duration, media, program, priority, effect, receiving_water, regulated_entity, county, description, comment, action_taken, url) FROM stdin;
\.


--
-- Name: complaints_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY complaints
    ADD CONSTRAINT complaints_pkey PRIMARY KEY (tracking_number);


--
-- Name: public; Type: ACL; Schema: -; Owner: -
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--


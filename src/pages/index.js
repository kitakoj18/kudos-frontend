import React from "react";
import { Router } from "@reach/router";
import Layout from "../components/Layout";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import CustomRoute from "../components/CustomRoute";
import { Helmet } from "react-helmet";

// markup
const IndexPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>Kudos Login</title>
        <meta name="description" content="Kudos" />
      </Helmet>
      <Router>
        <CustomRoute path="/" component={Login} />
        <CustomRoute path="/dashboard" component={Dashboard} />
      </Router>
    </Layout>
  );
};

export default IndexPage;

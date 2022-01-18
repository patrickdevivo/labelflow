import { isEmpty, join, map, toPairs } from "lodash/fp";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Cookies, useCookies } from "react-cookie";
import { AuthManager } from "../components/auth-manager";
import { CookieBanner } from "../components/cookie-banner";
import { Home } from "../components/home";
import { Layout } from "../components/layout";
import { NavLogo } from "../components/logo/nav-logo";
import { Meta } from "../components/meta";
import { WelcomeModal } from "../components/welcome-manager";

const IndexPage = () => {
  const router = useRouter();

  const [cookies] = useCookies(["hasUserTriedApp"]);
  const hasUserTriedApp = cookies.hasUserTriedApp === "true";

  useEffect(() => {
    if (!hasUserTriedApp) {
      router.replace({ pathname: "/website", query: router.query });
    }
  }, [hasUserTriedApp, router]);

  return (
    <>
      <WelcomeModal />
      <AuthManager />
      <Meta title="LabelFlow | Workspaces" />
      <CookieBanner />
      <Layout breadcrumbs={[<NavLogo key={0} />]}>
        <Home />
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const parsedCookie = new Cookies(context.req.headers.cookie);

  if (parsedCookie.get("hasUserTriedApp") === "true") return { props: {} };

  return {
    props: {},
    redirect: {
      // Keep query params after redirect
      destination: `/website${
        isEmpty(context.query)
          ? ""
          : `?${join(
              "&",
              map(([key, value]) => `${key}=${value}`, toPairs(context.query))
            )}`
      }`,
      permanent: false,
    },
  };
};

export default IndexPage;

import { NavBar } from "@/components/navbar";
import Footer from "@/components/footer";
import Container from "@/components/container";
export const metadata = {
  title: "تسجيل الدخول",
  description:
    "سجل دخولك إلى حسابك في Hash Plus للوصول إلى دوراتك المسجل بها ومتابعة تقدمك التعليمي.",
  keywords: [
    "تسجيل الدخول",
    "دخول الحساب",
    "تسجيل دخول Hash Plus",
    "الوصول للحساب",
    "دوراتي",
    "حسابي",
  ],
  openGraph: {
    title: "Hash Plus - تسجيل الدخول",
    description: "سجل دخولك للوصول إلى دوراتك ومتابعة تقدمك التعليمي",
    url: "https://hashplus.com/login",
    images: [
      {
        url: "/og-login.jpg",
        width: 1200,
        height: 630,
        alt: "Hash Plus - تسجيل الدخول",
      },
    ],
  },
  robots: {
    index: false,
    follow: true,
  },
};

import LoginCard from "@/components/login/loginCard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function loginPage() {
  const c = await cookies();
  const token = c.get("authToken")?.value;
  if (token) redirect("/dashboard/overview");

  return (
    <>
      <NavBar />
      <Container className="my-6 grid md:grid-cols-2 grid-cols-1 py-12 gap-10">
        <LoginCard />
      </Container>
      <Footer />
    </>
  );
}

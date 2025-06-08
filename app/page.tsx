import React from "react";
// import { RouteHandler } from 'react-router';

import { Button } from "@/components/ui/button";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Header></Header>
      <Button>Click me</Button>
      <Footer></Footer>
    </main>
  );
}

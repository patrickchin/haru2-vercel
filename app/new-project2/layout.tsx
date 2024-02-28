// import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import React from "react";

// const App = ({ Component, pageProps }: AppProps) => {
//   return <Component {...pageProps} />;
// };

// const DynApp = dynamic(() => Promise.resolve(App), {
//   ssr: false,
// });

// export default DynApp;

function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <p>aaaaaaaaaa</p>
      {children}
    </>
  );
}

export default dynamic(() => Promise.resolve(Layout), {
  ssr: false,
});

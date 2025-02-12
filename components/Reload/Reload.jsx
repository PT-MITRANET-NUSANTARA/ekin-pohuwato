import { useRouter } from "next/router";

export default function Reload() {
  const router = useRouter();

  return (
    <button onClick={() => router.replace(router.asPath)}>
      Refresh Data
    </button>
  );
}
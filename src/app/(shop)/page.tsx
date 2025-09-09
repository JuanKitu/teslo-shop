import {titleFont} from "@/app/config/fonts";

export default function Home() {
  return (
    <div className="">
        <h1> Hola mundo </h1>
        <h1 className={titleFont.className}> Hola mundo </h1>
    </div>
  );
}

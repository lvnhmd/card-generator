import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

async function uploadFile(formData: FormData) {
  "use server";
  const file =formData.get("file") as File;
  console.log("File name: ", file.name);
}

export default function IndexPage() {
  
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <form action={uploadFile}>
        <input type="file" name="file" id="file" />
        <button type="submit">Submit</button>
      </form>
    </section>
  )
}

// pages/index.js
// import { useState } from 'react';
// import Link from 'next/link';

// export default function Home() {
//   const [fileContent, setFileContent] = useState('');

//   const handleFileChange = async (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const text = await file.text();
//       setFileContent(text);
//       // Optionally, save the text to the session storage or pass it directly to the next page
//       sessionStorage.setItem('fileContent', text);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} accept=".txt" />
//       {fileContent && (
//         <Link href="/editor">
//           <a>Go to Editor</a>
//         </Link>
//       )}
//     </div>
//   );
// }

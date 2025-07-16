"use client";

import DOMPurify from "dompurify";
import React from "react";

interface HonbunBlock {
  fieldId: string;
  richEditor?: string;
  HTML?: string;
}

export default function HonbunRenderer({ honbun }: { honbun: HonbunBlock[] | null | undefined }) {
  if (!Array.isArray(honbun) || honbun.length === 0) {
    return <p className="text-gray-500 text-sm">本文がありません。</p>;
  }

  return (
    <div className="prose max-w-full dark:prose-invert">
      {honbun.map((block, index) => {
  if (block.fieldId === "richEditor" && block.richEditor) {
    return (
      <div
        key={index}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(block.richEditor) }}
      />
    );
  }

  if (block.fieldId === "HTML" && block.HTML) {
    return (
      <div key={index} className="my-6 w-full aspect-video relative overflow-hidden rounded-lg">
        <div
          className="[&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:w-full [&>iframe]:h-full"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(block.HTML, {
              ADD_TAGS: ["iframe"],
              ADD_ATTR: ["allowfullscreen", "scrolling"],
            }),
          }}
        />
      </div>
    );
  }

  return null;
})}

    </div>
  );
}

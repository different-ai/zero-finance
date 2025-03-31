'use client'; interface CodeBlockProps { node: any; inline: boolean; className: string; children: any;
} export function CodeBlock({ node, inline, className, children, ...props
}: CodeBlockProps) { if (!inline) { return ( <div className="not-prose flex flex-col"> <pre {...props} className={`text-sm w-full overflow-x-auto p-4 border border-zinc-200 rounded-xl text-zinc-900`} > <code className="whitespace-pre-wrap break-words">{children}</code> </pre> </div> ); } else { return ( <code className={`${className} text-sm bg-zinc-100 py-0.5 px-1 rounded-md`} {...props} > {children} </code> ); }
}

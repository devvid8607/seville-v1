declare module "set-cookie-parser" {
  interface Cookie {
    name: string;
    value: string;
    expires?: Date;
    maxAge?: number;
    domain?: string;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
  }

  interface ParseOptions {
    decodeValues?: boolean;
    map?: boolean;
  }

  function parse(input: string | string[], options?: ParseOptions): Cookie[];

  export = { parse };
}

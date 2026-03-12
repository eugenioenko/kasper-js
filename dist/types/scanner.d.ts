import { Token } from "./types/token";
export declare class Scanner {
    /** scripts source code */
    source: string;
    /** contains the source code represented as list of tokens */
    tokens: Token[];
    /** points to the current character being tokenized */
    private current;
    /** points to the start of the token  */
    private start;
    /** current line of source code being tokenized */
    private line;
    /** current column of the character being tokenized */
    private col;
    scan(source: string): Token[];
    private eof;
    private advance;
    private addToken;
    private match;
    private peek;
    private peekNext;
    private comment;
    private multilineComment;
    private string;
    private number;
    private identifier;
    private getToken;
    private error;
}

export interface JwtCustomContent {
    sub: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string | undefined;
}

export interface JwtStandardContent {
    iat: number;
} 

export interface JwtToken extends JwtCustomContent, JwtStandardContent {
}
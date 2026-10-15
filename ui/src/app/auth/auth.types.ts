export type TokenEnvelope = {
  status: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
  };
};

export type AuthConfigEnvelope = {
  status: string;
  data: {
    demoUser: string;
    demoPassword: string;
  };
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresAt: number;
  username: string;
};


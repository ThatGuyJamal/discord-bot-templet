/**
 * Structure for the environment variables configuration.
 */
export interface env_types {
  bot: {
    dev: boolean;
    prefix: string;
    token: string;
    test_guild_id: string;
  };
  database: {
    connection_url: string;
  };
  developer: {
    support_server: string;
    developer_id: string;
  };
}

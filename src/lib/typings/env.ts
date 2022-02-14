/**
 * Structure for the environment variables configuration.
 */
export interface env_types {
  bot: {
    dev: boolean;
    prefix: string;
    token: string;
    test_guild_id: string;
    register_commands: boolean;
  };
  database: {
    useDefault: boolean;
    dev: boolean;
    connection_url: string;
  };
  developer: {
    support_server: string;
    developer_id: string;
  };
}

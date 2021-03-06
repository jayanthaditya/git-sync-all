import newRegExp from 'newregexp';
import { Command as EcosystemCommand } from '@ecosystem/core';
import { flags } from '@oclif/command';
import { Config } from './types';

export default class Command extends EcosystemCommand {
  static description = 'keep all git repos in sync';

  static flags = {
    'source-blacklist': flags.string(),
    'source-username': flags.string(),
    'source-password': flags.string(),
    'source-groups': flags.string(),
    'source-owned': flags.boolean(),
    'source-server': flags.string(),
    'source-slug-regex': flags.string(),
    'source-token': flags.string(),
    'source-whitelist': flags.string(),
    'target-username': flags.string(),
    'target-password': flags.string(),
    'target-group': flags.string(),
    'target-project': flags.string(),
    'target-server': flags.string(),
    'target-token': flags.string()
  };

  async run() {
    const { flags } = this.parse(Command.EcosystemCommand);
    const config = await Command.EcosystemCommand.ecosystem.getConfig<Config>();
    return {
      runtimeConfig: {
        source: {
          owned: flags['source-owned'] || config.source.owned,
          username: flags['source-username'] || config.source.username,
          password: flags['source-password'] || config.source.password,
          server: flags['source-server'] || config.source.server,
          token: flags['source-token'] || config.source.token,
          blacklist: new Set([
            ...config.source.blacklist,
            ...(flags['source-blacklist']
              ? flags['source-blacklist'].split(',')
              : config.source.blacklist)
          ]),
          groups: new Set([
            ...config.source.groups,
            ...(flags['source-groups']
              ? flags['source-groups'].split(',')
              : config.source.groups)
          ]),
          slugRegex: newRegExp(
            flags['source-slug-regex']
              ? flags['source-slug-regex']
              : config.source.slugRegex
          ),
          whitelist: new Set([
            ...config.source.whitelist,
            ...(flags['source-whitelist']
              ? flags['source-whitelist'].split(',')
              : config.source.whitelist)
          ])
        },
        target: {
          username: flags['target-username'] || config.target.username,
          password: flags['target-password'] || config.target.password,
          group: flags['target-group'] || config.target.group,
          server: flags['target-server'] || config.target.server,
          token: flags['target-token'] || config.target.token,
          project:
            flags['target-project'] ||
            (config.target.project.length
              ? config.target.project
              : config.source.server.toUpperCase().substr(0, 3))
        }
      }
    };
  }
}

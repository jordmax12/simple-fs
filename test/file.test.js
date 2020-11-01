const { assert } = require('chai');
require('chai').should();
const { create_directory, write_file, write_yaml, read_yaml, path_exists, delete_file, force_delete_directory } = require('../src');
const base_temp_path = `${__dirname}temp`;
describe('File Helper', () => {
    describe('#file', () => {
      it('create_directory', () => {
        return new Promise(async resolve => {
          await create_directory(`${base_temp_path}`);
          resolve();
        })
      });
      describe('write_file', () => {
        it('write file', () => {
          return new Promise(async resolve => {
            await write_file(`${base_temp_path}/test1.json`, JSON.stringify({ test: 1 }, null, 4));
            const does_exist = await path_exists(`${base_temp_path}/test1.json`);
            assert.equal(does_exist.toString(), 'true');
            resolve();
          });
        });
        it('write yaml', () => {
          return new Promise(async resolve => {
            await write_yaml(`${base_temp_path}/test1.yml`, JSON.stringify({ app: 'override_me', service: 'override_me' }, null, 4));
            const does_exist = await path_exists(`${base_temp_path}/test1.yml`);
            assert.equal(does_exist.toString(), 'true');
            resolve();
          });
        });
        it('read yaml', () => {
          return new Promise(async resolve => {
            const read_resource = await read_yaml(`${base_temp_path}/test1.yml`);
            const _json = JSON.parse(read_resource);
            assert.equal(_json.app, 'override_me');
            assert.equal(_json.service, 'override_me');
            resolve();
          });
        });
        it('file exists', () => {
          return new Promise(async resolve => {
            const does_exist = await path_exists(`${base_temp_path}/test1.json`);
            assert.equal(does_exist.toString(), 'true');
            resolve();
          });
        })
        it('delete file', () => {
          return new Promise(async resolve => {
            const does_exist = await path_exists(`${base_temp_path}/test1.json`);
            assert.equal(does_exist.toString(), 'true');
            await delete_file(`${base_temp_path}/test1.json`);
            resolve();
          });
        });
        it('delete driectory', () => {
          return new Promise(async resolve => {
            await force_delete_directory(`${base_temp_path}`);
            resolve();
          });
        });
      })
    });
});
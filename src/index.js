const fs = require('fs');
const fs_extra = require('fs-extra');
const yaml = require('js-yaml');
const rimraf = require('rimraf');

const _read_file = (path, do_not_parse_json) => {
    return new Promise((resolve) => {
        fs.readFile(path, null, (err, data) => {
            if (err) {
                console.warn(err);
                resolve(null);
                return;
            }
            if (do_not_parse_json) resolve(data);
            else {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(data);
                }
            }
        });
    });
};

const _path_exists = (path) => {
    return new Promise((resolve) => {
        fs.access(path, (err) => {
            if (!err) {
                resolve(true);
                return;
            }
            resolve(false);
        });
    });
};

const _create_directory = (path) => {
    return new Promise(async (resolve) => {
        fs.access(path, (err) => {
            if (!err) {
                resolve();
                return;
            }

            fs.mkdir(path, null, () => {
                resolve();
            });
        });
    });
};

const _write_file = (path, data) => {
    return new Promise(async (resolve) => {
        try {
            fs.writeFile(path, data, null, () => {
                resolve(true);
            });
        } catch (e) {
            console.log('logging e', e);
            throw new Error(e);
        }
    });
};

const _write_yaml = (target_path, obj) => {
    return new Promise(async (resolve) => {
        let convert_object_to_yaml = yaml.safeDump(obj, {indent: 4});
        convert_object_to_yaml = convert_object_to_yaml.replace(/'Fn::GetAtt'/g, 'Fn::GetAtt');
        convert_object_to_yaml = convert_object_to_yaml.replace(/'Ref'/g, 'Ref');
        fs.writeFile(target_path, convert_object_to_yaml, (err) => {
            if (err) {
                console.warn(err);
                resolve(false);
            }

            resolve(true);
        });
    });
};

const _get_root_project_directory = () => {
    return `${process.cwd()}/`;
};

exports.doesLocalDirectoriesExist = async (directories) => {
    for (const dir of directories) {
        const does_exist = await _path_exists(dir);
        if (!does_exist) await _create_directory(`${_get_root_project_directory()}${dir}`);
    }

    return true;
};

exports.create_directory = async (path) => {
    return _create_directory(path);
};

exports.copy_directory = async (src, dest) => {
    fs_extra.copy(src, dest, (err) => {
        if (err) {
            console.error(err);
            return null;
        }
        return true;
    });
};

exports.copy_file = async (src, dest) => {
    return _copy_file(src, dest);
};

exports.delete_directory = async (path) => {
    if (fs.existsSync(path)) {
        fs.rmdir(path, (err) => {
            if (err) throw new Error(err);
            Promise.resolve(true);
        });
    }
};

exports.force_delete_directory = (path) => {
    return new Promise((resolve) => {
        try {
            rimraf(path, function () {
                resolve();
            });
        } catch (e) {
            console.error(e, null, false);
            resolve();
        }
    });
};

exports.read_file = (path, do_not_parse_json) => {
    return _read_file(path, do_not_parse_json);
};

exports.read_yaml = async (path) => {
    const exists = await _read_file(path, true);
    if (!exists) return null;
    return yaml.safeLoad(fs.readFileSync(path, 'utf8'));
};

exports.write_yaml = async (target_path, json) => {
    return _write_yaml(target_path, json);
};

exports.write_file = async (path, data) => {
    return _write_file(path, data);
};

exports.delete_file = async (path) => {
    try {
        return fs.unlinkSync(path);
    } catch (err) {
        console.error(err, false, false);
        return null;
    }
};

exports.path_exists = async (path) => {
    return _path_exists(path);
};

exports.root = () => {
    return _get_root_project_directory();
};

import {program} from 'commander'
import pkg from '../../package.json'
import {registerCommand} from './registerCommand'
import { info } from './base/info';
import { build } from './base/build';
import { preview } from './base/preview';
import { create } from './base/create';
import { serve } from './base/serve';



program.version(pkg.version).description(pkg.description);


registerCommand(info);

registerCommand(build);

registerCommand(preview);

registerCommand(create);

registerCommand(serve);

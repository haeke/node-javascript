import '../sass/style.scss';

import { $, $$ } from './modules/bling';
// where webpack bundles
import autocomplete from './modules/autocomplete';

autocomplete($('#address'), $('#lat'), $('#lng'));

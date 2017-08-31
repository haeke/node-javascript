import '../sass/style.scss';

import { $, $$ } from './modules/bling';
// where webpack bundles
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';

autocomplete($('#address'), $('#lat'), $('#lng'));

typeAhead($('.search'));

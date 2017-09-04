import '../sass/style.scss';

import { $, $$ } from './modules/bling';

// where webpack bundles
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';
import ajaxHeart from './modules/heart';

autocomplete($('#address'), $('#lat'), $('#lng'));

typeAhead($('.search'));
makeMap($('#map'));

//gather a list of forms that have been hearted and call the ajaxHeart method on submit
const heartForms = $$('form.heart');
heartForms.on('submit', ajaxHeart);

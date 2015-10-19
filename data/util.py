from __future__ import unicode_literals
import codecs
import json, os, sys
import numpy as np
import compmusic
import json
from compmusic import dunya as dn
from compmusic.dunya import hindustani as hn
from compmusic.dunya import carnatic as ca
from compmusic.dunya import docserver as ds
from compmusic import musicbrainz

dn.set_token("60312f59428916bb854adaa208f55eb35c3f2f07")
svaras = ['S', 'r', 'R', 'g', 'G', 'm', 'M', 'P', 'd', 'D', 'n', 'N']



def generate_raga_list(output_file):
    """
    This function generates ragalist for hindustani music collection in dunya.
    Format of the list <common_name>\t<raga_uuid>\t<><0>\t<Nodes>
    """

    fid = open(output_file,'w')
    #fetching a list of ragas
    ragas = hn.get_raags()

    format_string = "%s\t%s\t%s\t"+"%s\t"*len(svaras)
    #writing headers
    fid.write(format_string % ("Name", "UUID", "ThatId", 'S', 'r', 'R', 'g', 'G', 'm', 'M', 'P', 'd', 'D', 'n', 'N'))
    fid.write("\n")
    for ii, raga in enumerate(ragas):
        fid.write(format_string % (raga['common_name'], raga['uuid'], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0))
        fid.write("\n")
    fid.close()


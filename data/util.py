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
svaras_np = np.array(svaras)
thaats = {1: 'Bilawal', 2: 'Kalyan', 3:'Khamaj', 4: 'Bhairav', 5: 'Purvi', 6: 'Marwa', 7: 'Kafi', 8: 'Asawari', 9: 'Bhairavi', 10: 'Todi'}



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

def generate_svar_transition_empty_file(dir_name):
    """
    For annotating svar transitions this function creates a csv file
    """
    #fetching a list of ragas
    ragas = hn.get_raags()

    mtx = np.zeros((len(svaras)+1, len(svaras)+1)).astype(np.int).astype(np.str)
    mtx[1:, 0] = svaras
    mtx[0, 1:] = svaras
    mtx[0, 0] = '-'
    for ii, raga in enumerate(ragas):
        fname = os.path.join(dir_name, raga['uuid']+'.csv')
        np.savetxt(fname, mtx, fmt="%s", delimiter='\t')

def parse_phrase_file(filename):
    lines = codecs.open(filename, 'r', encoding = 'utf-8').readlines()
    phrases = []
    for ii , line in enumerate(lines):
        sline = line.split(',')
        sline = [int(s.strip())-1 for s in sline if s.strip() != '']
        phrases.append(sline)
    return phrases


def gen_indexing(raga_list_file, phrase_dir, transition_dir, raga_info_file, indexing_file):
    """
    this function parses the annotations which kaustuv has done, it produces two files
    1) raga_info_file: contains swaras, swara transitions and phrases for a raga
    2) indeing_file: which contains indexes for svaras, transitions and phrases (3 and 4 length index)
    """

    lines = codecs.open(raga_list_file, 'r', encoding = 'utf-8').readlines()
    raga_infos = {}
    for ii, line in enumerate(lines[1:]):
        raga_info = {}
        sline = line.split(',')
        sline = [s.strip() for s in sline]
        if int(sline[2]) <= 0:
            continue
        if not raga_info.has_key(sline[1]):
            raga_info[sline[1]] = {}
        raga_info['common_name'] = sline[0]
        raga_info['uuid'] = sline[1]
        raga_info['thaat'] = thaats[int(sline[2])]
        raga_info['svar_wghts'] = [float(s) for s in sline[3:]]
        ind_svar = np.where(np.array(raga_info['svar_wghts'])>0)[0]
        raga_info['svar_inds'] = ind_svar.tolist()
        raga_info['svars'] = svaras_np[ind_svar].tolist()
        #svar transition info (reading transition file)
        tran_file = os.path.join(transition_dir, raga_info['uuid']+'.csv')
        trans = np.loadtxt(tran_file, usecols=range(1,13), skiprows=1, delimiter = ',')
        raga_info['tran_mtx'] = trans.astype(np.float).tolist()
        #phrase info
        phrase_file = os.path.join(phrase_dir, raga_info['uuid']+'.csv')
        phrases = parse_phrase_file(phrase_file)
        raga_info['phrases'] = phrases
        raga_infos[sline[1]] = raga_info

    print "Parsing of info done!, now starting to build indexes"
    #now build indexes for all the infos
    raga_index = {}
    raga_index['svars'] = {}
    raga_index['transitions'] = {}
    raga_index['phrases_3n'] = {}
    raga_index['phrases'] = {}
    raga_index['phrases_4n'] = {}
    for uuid, r_info in raga_infos.items():
        #svar indexing
        for si in r_info['svar_inds']:
            if not raga_index['svars'].has_key(si):
                raga_index['svars'][si] = []
            raga_index['svars'][si].append({'uuid': uuid, 'common_name': r_info['common_name'], 'weight': r_info['svar_wghts'][si]})
        # svar transition indexing
        ind_nz = np.where(r_info['tran_mtx'])
        xys = zip(ind_nz[0], ind_nz[1])
        for xy in xys:
            if not raga_index['transitions'].has_key(xy[0]):
                raga_index['transitions'][xy[0]] = {}
            if not raga_index['transitions'][xy[0]].has_key(xy[1]):
                raga_index['transitions'][xy[0]][xy[1]] = []
            raga_index['transitions'][xy[0]][xy[1]].append({'uuid': uuid, 'common_name': r_info['common_name'], 'weight': r_info['tran_mtx'][xy[0]][xy[1]]})
        #phrase indexing
        for phrase in r_info['phrases']:
            p = '-'.join([str(kk) for kk in phrase])
            if not raga_index['phrases'].has_key(p):
                raga_index['phrases'][p] = []
            raga_index['phrases'][p].append({'uuid': uuid, 'common_name': r_info['common_name']})
            # if len(phrase)==3:
            #     if not raga_index['phrases_3n'].has_key(phrase[0]):
            #         raga_index['phrases_3n'][phrase[0]] = {}
            #     if not raga_index['phrases_3n'][phrase[0]].has_key(phrase[1]):
            #         raga_index['phrases_3n'][phrase[0]][phrase[1]] = {}
            #     if not raga_index['phrases_3n'][phrase[0]][phrase[1]].has_key(phrase[2]):
            #         raga_index['phrases_3n'][phrase[0]][phrase[1]][phrase[2]] = []

            #     raga_index['phrases_3n'][phrase[0]][phrase[1]][phrase[2]].append({'uuid': uuid, 'common_name': r_info['common_name']})

            # if len(phrase)==4:
            #     if not raga_index['phrases_4n'].has_key(phrase[0]):
            #         raga_index['phrases_4n'][phrase[0]] = {}
            #     if not raga_index['phrases_4n'][phrase[0]].has_key(phrase[1]):
            #         raga_index['phrases_4n'][phrase[0]][phrase[1]] = {}
            #     if not raga_index['phrases_4n'][phrase[0]][phrase[1]].has_key(phrase[2]):
            #         raga_index['phrases_4n'][phrase[0]][phrase[1]][phrase[2]] = {}
            #     if not raga_index['phrases_4n'][phrase[0]][phrase[1]][phrase[2]].has_key(phrase[3]):
            #         raga_index['phrases_4n'][phrase[0]][phrase[1]][phrase[2]][phrase[3]] = []

            #     raga_index['phrases_4n'][phrase[0]][phrase[1]][phrase[2]][phrase[3]].append({'uuid': uuid, 'common_name': r_info['common_name']})

    json.dump(raga_infos, codecs.open(raga_info_file,'w', encoding = 'utf-8'))
    json.dump(raga_index, codecs.open(indexing_file,'w', encoding = 'utf-8'))
    return True














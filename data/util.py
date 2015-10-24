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
raga2color = {u'24a85738-02e8-4b0e-9098-926f57c19a50': '#CCFFCC',
 u'2ed9379f-14c9-49af-8e4d-f9b63e96801f': '#FFA9E9',
 u'2fe9f79c-7955-4dcd-939a-e0a73173c07f': '#91FF6C',
 u'3eb7ba30-4b94-432e-9618-875ee57e01ab': '#9B9BAB',
 u'46997b02-f09c-4969-8138-4e1861f61967': '#6699FF',
 u'48b37bed-e847-4882-8a01-5c721e07f07d': '#999980',
 u'64e5fb9e-5569-4e80-8e6c-f543af9469c7': '#9966FF',
 u'6f13484e-6fdd-402d-baf3-3835835454d0': '#B8FFDB',
 u'774ae631-eb8d-4b8e-9edd-5285e919821f': '#7C7C89',
 u'78f439fa-88ba-480e-be87-4d65311df381': '#B29980',
 u'80f3ec4b-d9db-4bc3-8186-9e6b0581f31a': '#70944D',
 u'93c73081-bdf8-4eca-b325-d736b71e9b4b': '#669999',
 u'9571385f-2743-41a1-9c6d-3db0545a6773': '#FFDB4D',
 u'96ef352a-9baf-4ba9-a628-9cabb59b2175': '#99FFCC',
 u'a7d98897-e2fe-4d75-b9dc-e5b4dc88e1c6': '#A34775',
 u'd3be1a2a-ad82-495b-b738-b5e3dd664a0c': '#CCFFCC',
 u'dd59147d-8775-44ff-a36b-0d9f15b31319': '#5C85FF',
 u'f6432fec-e9c2-4b09-9e73-c46086cbd8ea': '#FFB547',
 u'f7fddfc0-8c1d-4dd2-90d5-5d51a99d61f8': '#80CCCC',
 u'fa28470c-d413-44c7-94da-181f530cbfdd': '#3399FF'}


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


def gen_indexing(raga_list_file, phrase_dir, transition_dir, raga_info_file, thaat_info_file, indexing_file):
    """
    this function parses the annotations which kaustuv has done, it produces two files
    1) raga_info_file: contains swaras, swara transitions and phrases for a raga
    2) indeing_file: which contains indexes for svaras, transitions and phrases (3 and 4 length index)
    """

    lines = codecs.open(raga_list_file, 'r', encoding = 'utf-8').readlines()
    raga_infos = {}
    thaat_info = {}
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
        if not thaat_info.has_key(raga_info['thaat']):
            thaat_info[raga_info['thaat']] = {}
        thaat_info[raga_info['thaat']][raga_info['uuid']] = {'uuid': raga_info['uuid'], 'common_name': raga_info['common_name'], 'likelihood':0, 'color': raga2color[raga_info['uuid']]}

    print "Parsing of info done!, now starting to build indexes"
    #now build indexes for all the infos
    raga_index = {}
    raga_index['svars'] = {}
    raga_index['transitions'] = {}
    raga_index['phrases'] = {}
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
            p = '-'.join([str(svaras[kk]) for kk in phrase])
            if not raga_index['phrases'].has_key(p):
                raga_index['phrases'][p] = []
            raga_index['phrases'][p].append({'uuid': uuid, 'common_name': r_info['common_name']})    
    json.dump(raga_infos, codecs.open(raga_info_file,'w', encoding = 'utf-8'))
    json.dump(raga_index, codecs.open(indexing_file,'w', encoding = 'utf-8'))
    json.dump(thaat_info, codecs.open(thaat_info_file,'w', encoding = 'utf-8'))
    return True














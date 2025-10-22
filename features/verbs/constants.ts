export const VERB_CATEGORIES: Record<string, string[]> = {
    'Essentiels': ['essere', 'avere', 'fare', 'andare', 'stare', 'dare', 'venire', 'dire', 'potere', 'volere'],
    'Réguliers -are': ['parlare', 'mangiare', 'guardare', 'camminare', 'studiare', 'lavorare', 'abitare', 'comprare'],
    'Réguliers -ere': ['credere', 'vendere', 'ricevere', 'ripetere', 'temere', 'perdere'],
    'Réguliers -ire': ['dormire', 'partire', 'sentire', 'aprire', 'offrire', 'seguire', 'servire'],
    'Irréguliers': ['sapere', 'dovere', 'uscire', 'bere', 'rimanere', 'tenere', 'porre', 'tradurre', 'condurre'],
};

export const MODES = ['Indicativo', 'Congiuntivo', 'Condizionale', 'Imperativo', 'Infinito', 'Participio', 'Gerundio'];

export const TENSES = [
    'Presente',
    'Passato prossimo',
    'Imperfetto',
    'Trapassato prossimo',
    'Passato remoto',
    'Trapassato remoto',
    'Futuro semplice',
    'Futuro anteriore',
];

export const TENSES_BY_MOOD: Record<string, string[]> = {
    'Indicativo': [
        'Presente',
        'Passato prossimo',
        'Imperfetto',
        'Trapassato prossimo',
        'Passato remoto',
        'Trapassato remoto',
        'Futuro semplice',
        'Futuro anteriore',
    ],
    'Congiuntivo': [
        'Presente',
        'Passato',
        'Imperfetto',
        'Trapassato',
    ],
    'Condizionale': [
        'Presente',
        'Passato',
    ],
    'Imperativo': [
        'Presente',
    ],
    'Infinito': [
        'Presente',
        'Passato',
    ],
    'Participio': [
        'Presente',
        'Passato',
    ],
    'Gerundio': [
        'Presente',
        'Passato',
    ],
};

export const COMMON_VERBS = [
    'essere', 'avere', 'fare', 'andare', 'stare', 'dare', 'venire', 'dire',
    'potere', 'volere', 'sapere', 'dovere', 'parlare', 'mangiare', 'vedere',
    'prendere', 'uscire', 'capire', 'finire', 'mettere', 'leggere', 'scrivere',
];

from sqlalchemy import Column, String, BigInteger, Integer, DateTime, ForeignKey, Sequence
import datetime
from functools import cache

import sqlengine.sqlengine as SqlEngine

from . import BaseModel

@cache # funny thing, it makes from this function a singleton
def GetModels(BaseModel=BaseModel.getBaseModel(), unitedSequence=Sequence('all_id_seq')):
    """create elementary models for information systems

    Parameters
    ----------
    BaseModel
        represents the declarative_base instance from SQLAlchemy
    unitedSequence : Sequence
        represents a method for generating keys (usually ids) for database entities

    Returns
    -------
    (UserModel, GroupModel, RoleModel, GroupTypeModel, RoleTypeModel)
        tuple of models based on BaseModel, table names are hardcoded

    """

    #assert not(unitedSequence is None), "unitedSequence must be defined"
    print('Base models definition (ProgramModel, SubjectModel, SubjectSemesterModel, TopicModel)')
    class ProgramModel(BaseModel):
        __tablename__ = 'programs'
        
        id = Column(BigInteger, unitedSequence, primary_key=True)
        name = Column(String)
        
        lastchange = Column(DateTime, default=datetime.datetime.now)
        externalId = Column(BigInteger, index=True)


    class SubjectModel(BaseModel):
        __tablename__ = 'subjects'
        
        id = Column(BigInteger, unitedSequence, primary_key=True)
        name = Column(String)
        
        lastchange = Column(DateTime, default=datetime.datetime.now)
        externalId = Column(String, index=True)
        
    class SubjectSemesterModel(BaseModel):
        __tablename__ = 'subjectsemesters'

        id = Column(BigInteger, unitedSequence, primary_key=True)
        name = Column(String)
        
        lastchange = Column(DateTime, default=datetime.datetime.now)

    class TopicModel(BaseModel):
        __tablename__ = 'topics'
        
        id = Column(BigInteger, unitedSequence, primary_key=True)
        name = Column(String)
        
    class SubjectUserRoleModel(BaseModel):
        __tablename__ = 'subjectuserroles'
        id = Column(BigInteger, unitedSequence, primary_key=True)
        name = Column(String)

    class SubjectUserRoleTypeModel(BaseModel):
        __tablename__ = 'subjectuserroletypes'
        id = Column(BigInteger, unitedSequence, primary_key=True)
        name = Column(String)

    class ProgramUserRoleTypeModel(BaseModel):
        __tablename__ = 'programuserroletypes'
        id = Column(BigInteger, unitedSequence, primary_key=True)
        name = Column(String)

    return ProgramModel, SubjectModel, SubjectSemesterModel, TopicModel, SubjectUserRoleModel, SubjectUserRoleTypeModel, ProgramUserRoleTypeModel


from . import Relations 
from . import BaseEntities
@cache
def BuildRelations():
    UserModel, GroupModel, RoleModel, GroupTypeModel, RoleTypeModel = BaseEntities.GetModels()
    ProgramModel, SubjectModel, SubjectSemesterModel, TopicModel, SubjectUserRoleModel, SubjectUserRoleTypeModel, ProgramUserRoleTypeModel = GetModels()
    print('building relations between base models')

    Relations.defineRelation1N(ProgramModel, SubjectModel) 
    Relations.defineRelation1N(SubjectModel, SubjectSemesterModel)
    Relations.defineRelation1N(SubjectSemesterModel, TopicModel)

    Relations.defineRelationNM(UserModel, SubjectModel, tableAItemName='grantingsubjects', tableBItemName='guarantors')

    print('building relations between base models finished')
    #defineRelationNM(BaseModel, EventModel, UserModel, 'teachers', 'events')

    pass

from types import MappingProxyType

@cache
def ensureData(SessionMaker):
    def ensureDataItem(session, Model, name):
        itemRecords = session.query(Model).filter(Model.name == name).all()
        itemRecordsLen = len(itemRecords)
        if itemRecordsLen == 0:
            itemRecord = Model(name=name)
            session.add(itemRecord)
            session.commit()
        else:
            assert itemRecordsLen == 1, f'Database has inconsistencies {Model}, {name}'
            itemRecord = itemRecords[0]
        return itemRecord.id

    ProgramModel, SubjectModel, SubjectSemesterModel, TopicModel, SubjectUserRoleModel, SubjectUserRoleTypeModel, ProgramUserRoleTypeModel = GetModels()
    session = SessionMaker()
    try:
        guaranteeSubjectTypeId = ensureDataItem(session, SubjectUserRoleTypeModel, 'guarantee')
        teacherTypeId = ensureDataItem(session, SubjectUserRoleTypeModel, 'teacher')
        guaranteeDeputySubjectTypeId =  ensureDataItem(session, SubjectUserRoleTypeModel, 'guarantee deputy')

        guaranteeProgramTypeId = ensureDataItem(session, ProgramUserRoleTypeModel, 'guarantee')
        guaranteeDeputyProgramTypeId =  ensureDataItem(session, ProgramUserRoleTypeModel, 'guarantee deputy')

        result = {
            'guaranteeSubjectTypeId': guaranteeSubjectTypeId,
            'teacherTypeId': teacherTypeId,
            'guaranteeDeputySubjectTypeId': guaranteeDeputySubjectTypeId,
            'guaranteeProgramTypeId': guaranteeProgramTypeId,
            'guaranteeDeputyProgramTypeId': guaranteeDeputyProgramTypeId
        }    
    finally:
        session.close()
    return MappingProxyType(result)

import random
def PopulateRandomData(SessionMaker):
    session = SessionMaker()

    ProgramModel, SubjectModel, SubjectSemesterModel, TopicModel = GetModels()

    def randomizedTopic(subject, semester, index):
        randomName = f'{subject.name}-{semester.name}-{index+1}'
        record = TopicModel(name=randomName)
        session.add(record)
        session.commit()
        pass

    def randomizedSemester(subject):
        record = SubjectSemesterModel(name='')
        session.add(record)
        session.commit()

        semesterCount = random.randrange(1, 3)
        for _ in range(semesterCount):
            randomizedTopic(subject, record)
        
        session.commit()
        pass

    subjectNames = randomSubjectNames()
    def randomizedSubject(program):
        subjectRecord = SubjectModel(name=random.choice(subjectNames))
        session.add(subjectRecord)
        program.subjects.append(subjectRecord)
        session.commit()
        
        semestersCount = random.randrange(10, 15)
        for _ in range(semestersCount):
            randomizedSemester(subjectRecord)
        
        
        pass


    strsA = ['IT', 'EL', 'MIL', 'GEO', 'ST']
    strsB = ['Bc', 'Mgr', 'Dr']
    strsC = ['P', 'K', 'O']
    def randomizedProgram():
        year = random.randrange(2015, 2020)
        randomName = f'{random.choice(strsA)}-{random.choice(strsB)}-{random.choice(strsC)}/{year}'
        programRecord = ProgramModel(name=randomName)
        session.add(programRecord)
        session.commit()
        subjectsCount = random.randrange(10, 15)
        for _ in range(subjectsCount):
            randomizedSubject(programRecord)
        pass

    try:
        randomizedProgram()
        pass
    finally:
        session.close()

    pass

def randomSubjectNames():
    data = randomSubjectNamesStr()
    result = data.replace(' (v angli??tin??)', '').split('/n')
    resultArray = [item[:-1] if item[-1] in ['1', '2'] else item for item in result]
    return resultArray

def randomSubjectNamesStr():
    return """3D optick?? digitalizace 1
Agentn?? a multiagentn?? syst??my
Aktu??ln?? t??mata grafick??ho designu
Algebra
Algoritmy
Algoritmy (v angli??tin??)
Analogov?? elektronika 1
Analogov?? elektronika 2
Analogov?? technika
Anal??za a n??vrh informa??n??ch syst??m??
Anal??za bin??rn??ho k??du
Anal??za syst??m?? zalo??en?? na modelech
Anglick?? konverzace na aktu??ln?? t??mata
Anglick?? konverzace na aktu??ln?? t??mata
Angli??tina 1: m??rn?? pokro??il?? 1
Angli??tina 2: m??rn?? pokro??il?? 2
Angli??tina 3: st??edn?? pokro??il?? 1
Angli??tina 3: st??edn?? pokro??il?? 1
Angli??tina 4: st??edn?? pokro??il?? 2
Angli??tina 4: st??edn?? pokro??il?? 2
Angli??tina pro doktorandy
Angli??tina pro Evropu
Angli??tina pro Evropu
Angli??tina pro IT
Angli??tina pro IT
Angli??tina: praktick?? kurz obchodn?? konverzace a prezentace
Aplikace paraleln??ch po????ta????
Aplikovan?? hern?? studia - v??zkum a design
Aplikovan?? evolu??n?? algoritmy
Architektura 20. stolet??
Architektury v??po??etn??ch syst??m??
Audio elektronika
Automatizovan?? testov??n?? a dynamick?? anal??za
Autorsk?? pr??va - letn??
Bakal????sk?? pr??ce
Bakal????sk?? pr??ce Erasmus (v angli??tin??)
Bayesovsk?? modely pro strojov?? u??en?? (v angli??tin??)
Bezdr??tov?? a mobiln?? s??t??
Bezpe??n?? za????zen??
Bezpe??nost a po????ta??ov?? s??t??
Bezpe??nost informa??n??ch syst??m??
Bezpe??nost informa??n??ch syst??m?? a kryptografie
Bioinformatika
Bioinformatika
Biologi?? inspirovan?? po????ta??e
Biometrick?? syst??my
Biometrick?? syst??my (v angli??tin??)
Blockchainy a decentralizovan?? aplikace
CCNA Kybernetick?? bezpe??nost (v angli??tin??)
??esk?? um??n?? 1. poloviny 20. stolet?? v souvislostech - zimn??
??esk?? um??n?? 2. poloviny 20. stolet?? v souvislostech - letn??
Chemoinformatika
????slicov?? zpracov??n?? akustick??ch sign??l??
????slicov?? zpracov??n?? sign??l?? (v angli??tin??)
CNC obr??b??n?? / Roboti v um??leck?? praxi
Da??ov?? syst??m ??R
Datab??zov?? syst??my
Datab??zov?? syst??my (v angli??tin??)
D??jiny a filozofie techniky
D??jiny a kontexty fotografie 1
D??jiny a kontexty fotografie 2
D??jiny designu 1 - letn??
D??jiny designu 1 - zimn??
Desktop syst??my Microsoft Windows
Digit??ln?? forenzn?? anal??za (v angli??tin??)
Digit??ln?? marketing a soci??ln?? m??dia (v angli??tin??)
Digit??ln?? socha??stv?? - 3D tisk 1
Digit??ln?? socha??stv?? - 3D tisk 2
Diplomov?? pr??ce
Diplomov?? pr??ce (v angli??tin??)
Diplomov?? pr??ce Erasmus (v angli??tin??)
Diskr??tn?? matematika
Dynamick?? jazyky
Ekonomie informa??n??ch produkt??
Elektroakustika 1
Elektronick?? obchod (v angli??tin??)
Elektronika pro informa??n?? technologie
Elektrotechnick?? semin????
Evolu??n?? a neur??ln?? hardware
Evolu??n?? v??po??etn?? techniky
Filozofie a kultura
Finan??n?? anal??za
Finan??n?? management pro informatiky
Finan??n?? trhy
Form??ln?? anal??za program??
Form??ln?? jazyky a p??eklada??e
Form??ln?? jazyky a p??eklada??e (v angli??tin??)
Funkcion??ln?? a logick?? programov??n??
Funk??n?? verifikace ????slicov??ch syst??m??
Fyzika 1 - fyzika pro audio in??en??rstv??
Fyzika v elektrotechnice (v angli??tin??)
Fyzik??ln?? optika
Fyzik??ln?? optika (v angli??tin??)
Fyzik??ln?? semin????
Grafick?? a zvukov?? rozhran?? a normy
Grafick?? u??ivatelsk?? rozhran?? v Jav??
Grafick?? u??ivatelsk?? rozhran?? v Jav?? (v angli??tin??)
Grafick?? u??ivatelsk?? rozhran?? v X Window
Grafick?? a multimedi??ln?? procesory
Grafov?? algoritmy
Grafov?? algoritmy (v angli??tin??)
Hardware/Software Codesign
Hardware/Software Codesign (v angli??tin??)
Hern?? studia
Informa??n?? syst??my
Informa??n?? v??chova a gramotnost
Inteligentn?? syst??my
Inteligentn?? syst??my
Internetov?? aplikace
In??en??rsk?? pedagogika a didaktika
In??en??rsk?? pedagogika a didaktika
Jazyk C
Klasifikace a rozpozn??v??n??
K??dov??n?? a komprese dat
Komunika??n?? syst??my pro IoT
Konvolu??n?? neuronov?? s??t??
Kritick?? anal??za digit??ln??ch her
Kruhov?? konzultace
Kryptografie
Kultura projevu a tvorba text??
Kultura projevu a tvorba text??
Kurz pornostudi??
Line??rn?? algebra
Line??rn?? algebra
Logika
Makroekonomie
Management
Management projekt??
Mana??ersk?? komunikace a prezentace
Mana??ersk?? komunikace a prezentace
Mana??ersk?? veden?? lid?? a ????zen?? ??asu
Mana??ersk?? veden?? lid?? a ????zen?? ??asu
Matematick?? anal??za 1
Matematick?? anal??za 2
Matematick?? logika
Matematick?? struktury v informatice (v angli??tin??)
Matematick?? v??po??ty pomoc?? MAPLE
Matematick?? z??klady fuzzy logiky
Matematick?? semin????
Matematick?? software
Matematika 2
Maticov?? a tenzorov?? po??et
Mechanika a akustika
Mikroekonomie
Mikroprocesorov?? a vestav??n?? syst??my
Mikroprocesorov?? a vestav??n?? syst??my (v angli??tin??)
Mobiln?? roboty
Modelov??n?? a simulace
Modelov??n?? a simulace
Modern?? matematick?? metody v informatice
Modern?? metody zobrazov??n?? 3D sc??ny
Modern?? metody zpracov??n?? ??e??i
Modern?? teoretick?? informatika
Modern?? trendy informatiky (v angli??tin??)
Molekul??rn?? biologie
Molekul??rn?? genetika
Multim??dia
Multim??dia (v angli??tin??)
Multim??dia v po????ta??ov??ch s??t??ch
N??vrh a implementace IT slu??eb
N??vrh a realizace elektronick??ch p????stroj??
N??vrh ????slicov??ch syst??m??
N??vrh ????slicov??ch syst??m?? (v angli??tin??)
N??vrh kyberfyzik??ln??ch syst??m?? (v angli??tin??)
N??vrh po????ta??ov??ch syst??m??
N??vrh vestav??n??ch syst??m??
N??vrh, spr??va a bezpe??nost
Opera??n?? syst??my
Optick?? s??t??
Optika
Optimalizace
Optimaliza??n?? metody a teorie hromadn?? obsluhy
Optim??ln?? ????zen?? a identifikace
Paraleln?? a distribuovan?? algoritmy
Paraleln?? v??po??ty na GPU
Pedagogick?? psychologie
Pedagogick?? psychologie
Plo??n?? spoje a povrchov?? mont????
Po????ta??ov?? fyzika I
Po????ta??ov?? fyzika II
Po????ta??ov?? grafika
Po????ta??ov?? grafika
Po????ta??ov?? grafika (v angli??tin??)
Po????ta??ov?? podpora konstruov??n??
Po????ta??ov?? komunikace a s??t??
Po????ta??ov?? vid??n?? (v angli??tin??)
Po????ta??ov?? semin????
Podnikatelsk?? laborato??
Podnikatelsk?? minimum
Pokro??il?? bioinformatika
Pokro??il?? matematika
Pokro??il?? po????ta??ov?? grafika (v angli??tin??)
Pokro??il?? t??mata administrace opera??n??ho syst??mu Linux
Pokro??il?? asemblery
Pokro??il?? biometrick?? syst??my
Pokro??il?? ????slicov?? syst??my
Pokro??il?? datab??zov?? syst??my
Pokro??il?? datab??zov?? syst??my (v angli??tin??)
Pokro??il?? informa??n?? syst??my
Pokro??il?? komunika??n?? syst??my (v angli??tin??)
Pokro??il?? opera??n?? syst??my
Pokro??il?? sm??rov??n?? v p??te??n??ch s??t??ch (ENARSI)
Pokro??il?? techniky n??vrhu ????slicov??ch syst??m??
Pokro??il?? n??vrh a zabezpe??en?? podnikov??ch s??t??
Praktick?? aspekty v??voje software
Praktick?? paraleln?? programov??n??
Pravd??podobnost a statistika
Pr??vn?? minimum
Pr??vn?? minimum
Pr??vo informa??n??ch syst??m??
P??enos dat, po????ta??ov?? s??t?? a protokoly
P??enos dat, po????ta??ov?? s??t?? a protokoly (v angli??tin??)
Principy a n??vrh IoT syst??m??
Principy programovac??ch jazyk?? a OOP
Principy programovac??ch jazyk?? a OOP (v angli??tin??)
Principy synt??zy testovateln??ch obvod??
Programovac?? semin????
Programov??n?? na strojov?? ??rovni
Programov??n?? v .NET a C#
Programov??n?? za????zen?? Apple
Projektov?? praxe 1
Projektov?? praxe 1
Projektov?? praxe 1 (v angli??tin??)
Projektov?? praxe 1 (v angli??tin??)
Projektov?? praxe 1 (v angli??tin??)
Projektov?? praxe 1 (v angli??tin??)
Projektov?? praxe 2
Projektov?? praxe 2
Projektov?? praxe 2 (v angli??tin??)
Projektov?? praxe 2 (v angli??tin??)
Projektov?? praxe 3
Projektov??n?? datov??ch s??t??
Projektov?? mana??er
Prost??ed?? distribuovan??ch aplikac??
R??diov?? komunikace
Regulovan?? gramatiky a automaty
R??torika
R??torika
????zen?? a regulace 1
????zen?? a regulace 2
Robotika (v angli??tin??)
Robotika a manipul??tory
Robotika a zpracov??n?? obrazu
Semestr??ln?? projekt
Semestr??ln?? projekt
Semestr??ln?? projekt (v angli??tin??)
Semestr??ln?? projekt Erasmus (v angli??tin??)
Semestr??ln?? projekt Erasmus (v angli??tin??)
Semin???? C#
Semin???? C++
Semin???? diskr??tn?? matematiky a logiky
Semin???? Java
Semin???? Java (v angli??tin??)
Semin???? VHDL
Senzory a m????en??
Serverov?? syst??my Microsoft Windows
Sign??ly a syst??my
Simula??n?? n??stroje a techniky
S????ov?? kabel???? a sm??rov??n?? (CCNA1+CCNA2)
S????ov?? aplikace a spr??va s??t??
Skriptovac?? jazyky
Slo??itost (v angli??tin??)
Sm??rov??n?? a p??ep??n??n?? v p??te??n??ch s??t??ch (ENCOR)
Soft Computing
??pan??l??tina: za????te??n??ci 1/2
??pan??l??tina: za????te??n??ci 2/2
Spr??va server?? IBM zSeries
Statick?? anal??za a verifikace
Statistika a pravd??podobnost
Statistika, stochastick?? procesy, opera??n?? v??zkum
Strategick?? ????zen?? informa??n??ch syst??m??
Strojov?? u??en?? a rozpozn??v??n??
Syst??mov?? biologie
Syst??my odoln?? proti poruch??m
Syst??my odoln?? proti poruch??m
Syst??my pracuj??c?? v re??ln??m ??ase (v angli??tin??)
Technologie s??t?? LAN a WAN (CCNA3+4)
Teoretick?? informatika
Teoretick?? informatika (v angli??tin??)
Teorie a aplikace Petriho s??t??
Teorie her
Teorie kategori?? v informatice
Teorie programovac??ch jazyk??
Testov??n?? a dynamick?? anal??za
Tvorba aplikac?? pro mobiln?? za????zen?? (v angli??tin??)
Tvorba u??ivatelsk??ch rozhran??
Tvorba u??ivatelsk??ch rozhran?? (v angli??tin??)
Tvorba webov??ch str??nek
Tvorba webov??ch str??nek (v angli??tin??)
Typografie a publikov??n??
????etnictv??
Ukl??d??n?? a p????prava dat
Um??l?? inteligence a strojov?? u??en??
??vod do molekul??rn?? biologie a genetiky
??vod do softwarov??ho in??en??rstv??
U??ivatelsk?? zku??enost a n??vrh rozhran?? a slu??eb (v angli??tin??)
V??deck?? publikov??n?? od A do Z
Vizualizace a CAD (v angli??tin??)
Vizu??ln?? styly digit??ln??ch her 1
Vizu??ln?? styly digit??ln??ch her 2
Vybran?? t??mata z anal??zy a p??ekladu jazyk??
Vybran?? kapitoly z matematiky
Vybran?? partie z matematiky I.
Vybran?? partie z matematiky II.
Vybran?? probl??my informa??n??ch syst??m??
V??po??etn?? fotografie
V??po??etn?? geometrie
V??po??etn?? geometrie (v angli??tin??)
Vysoce n??ro??n?? v??po??ty
Vysoce n??ro??n?? v??po??ty
Vysoce n??ro??n?? v??po??ty (v angli??tin??)
V??stavba p??eklada???? (v angli??tin??)
V??tvarn?? informatika
Zabezpe??ovac?? syst??my
Zahrani??n?? odborn?? praxe
Zahrani??n?? odborn?? praxe
Z??klady ekonomiky podniku
Z??klady financov??n??
Z??klady hern??ho v??voje
Z??klady hudebn?? akustiky
Z??klady marketingu
Z??klady po????ta??ov?? grafiky
Z??klady programov??n??
Z??klady um??l?? inteligence
Z??klady um??l?? inteligence (v angli??tin??)
Z??sk??v??n?? znalost?? z datab??z??
Zkou??ka z jazyka anglick??ho pro Ph.D.
Zobrazovac?? syst??my v l??ka??stv??
Zpracov??n?? a vizualizace dat v prost??ed?? Python
Zpracov??n?? obrazu
Zpracov??n?? obrazu (v angli??tin??)
Zpracov??n?? p??irozen??ho jazyka
Zpracov??n?? p??irozen??ho jazyka (v angli??tin??)
Zpracov??n?? ??e??i a audia ??lov??kem a po????ta??em
Zpracov??n?? ??e??ov??ch sign??l??
Zpracov??n?? ??e??ov??ch sign??l?? (v angli??tin??)
Zvukov?? software"""
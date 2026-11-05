"""Hand-curated word lists for the semantic rooms. Secrets are common, concrete, safe nouns.
Anchors are the divergent room's daily "palavra-âncora". BLOCK removes offensive words from
the shipped vocabulary (they can't be hints or neighbours). Edit freely; rerun build_word_space.py."""

SECRETS = {
    'pt-BR': '''casa árvore janela chapéu maçã nuvem espelho relógio ponte barco montanha praia cadeira mesa livro
chave porta escada lua estrela chuva neve rio floresta cavalo gato cachorro pássaro peixe baleia abelha borboleta
flor rosa café pão queijo chocolate bolo música piano violão tambor carro trem avião bicicleta foguete castelo
igreja escola hospital mercado cozinha jardim cidade ilha deserto vulcão oceano trovão fogo gelo vento sombra
sonho memória viagem festa bola futebol teatro cinema pintura fotografia carta jornal telefone computador robô
máquina martelo faca garfo colher copo garrafa vela lâmpada chuveiro travesseiro cama sapato camisa gravata
anel coroa rei rainha soldado médico professor criança amigo coração olho cérebro osso dente cabelo mapa
bússola tesouro pirata fantasma dragão labirinto enigma segredo palavra número mistério silêncio sorriso
lágrima abraço moeda ouro diamante pedra areia onda farol navio âncora planeta galáxia cometa tigre leão
elefante macaco coruja serpente aranha formiga tartaruga golfinho uva banana laranja limão tomate cenoura
milho arroz feijão açúcar mel leite ovo sopa pipoca sorvete pizza chá janela guitarra circo palhaço mágico
museu biblioteca estátua torre muralha caverna cachoeira lago neblina arco-íris aurora inverno verão'''.split(),
    'en': '''house tree window hat apple cloud mirror clock bridge boat mountain beach chair table book key door
ladder moon star rain snow river forest horse cat dog bird fish whale bee butterfly flower rose coffee bread
cheese chocolate cake music piano guitar drum car train airplane bicycle rocket castle church school hospital
market kitchen garden city island desert volcano ocean thunder fire ice wind shadow dream memory journey party
ball football theater cinema painting photograph letter newspaper telephone computer robot machine hammer knife
fork spoon glass bottle candle lamp shower pillow bed shoe shirt tie ring crown king queen soldier doctor
teacher child friend heart eye brain bone tooth hair map compass treasure pirate ghost dragon labyrinth riddle
secret word number mystery silence smile tear hug coin gold diamond stone sand wave lighthouse ship anchor
planet galaxy comet tiger lion elephant monkey owl snake spider ant turtle dolphin grape banana orange lemon
tomato carrot corn rice bean sugar honey milk egg soup popcorn pizza tea circus clown magician museum library
statue tower wall cave waterfall lake fog rainbow winter summer umbrella pipe violin'''.split(),
}

ANCHORS = {
    'pt-BR': '''chapéu maçã nuvem espelho cachimbo guarda-chuva pedra pássaro janela céu chave vela relógio
sombra porta mar folha ovo sino trem gaiola lua'''.split(),
    'en': '''hat apple cloud mirror pipe umbrella stone bird window sky key candle clock shadow door sea leaf
egg bell train cage moon'''.split(),
}

BLOCK = set('''merda porra caralho buceta cu foda foder puta puto viado bicha retardado macaco_ofensa
fuck shit bitch cunt nigger faggot retard whore slut'''.split())

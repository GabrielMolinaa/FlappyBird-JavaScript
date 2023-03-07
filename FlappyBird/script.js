const canvas = document.querySelector("canvas");
const contexto = canvas.getContext("2d");

let frames = 0;
const hit = new Audio();
hit.src = "./assets/hit.wav";
const sprites = new Image();
sprites.src = "sprites.png";

const musica = new Audio();
musica.src = "./assets/musica.mp3";

const morreu = new Audio();
morreu.src = "./assets/morreu.mp3";

const telaDeInicio = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y:50,

    desenha(){
        contexto.drawImage(
            sprites,
            telaDeInicio.spriteX, telaDeInicio.spriteY,
            telaDeInicio.largura, telaDeInicio.altura,
            telaDeInicio.x, telaDeInicio.y,
            telaDeInicio.largura, telaDeInicio.altura
        );
    }
}

const mensagemGameOver = {
    spriteX: 134,
    spriteY: 153,
    largura: 226,
    altura: 200,
    x: (canvas.width / 2) - 226 / 2,
    y:50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGameOver.spriteX, mensagemGameOver.spriteY,
            mensagemGameOver.largura, mensagemGameOver.altura,
            mensagemGameOver.x, mensagemGameOver.y,
            mensagemGameOver.largura, mensagemGameOver.altura
        );
    }
}

const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,

    desenha(){

        contexto.fillStyle = "#00BFFF";
        contexto.fillRect(0,0,canvas.width,canvas.height);

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x+planoDeFundo.largura, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
    }
}

//CHAO
function criaChao(){
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
    
        atualiza(){
            const movimentoChao = 1;
            const repeteEm = chao.largura/2;
            const movimentacao = chao.x - movimentoChao;

            chao.x = movimentacao % repeteEm;
        },
        desenha(){
            contexto.drawImage(
                sprites,
                chao.spriteX,
                chao.spriteY,
                chao.largura,
                chao.altura,
                chao.x,
                chao.y,
                chao.largura,
                chao.altura
            );
    
            contexto.drawImage(
                sprites,
                chao.spriteX,
                chao.spriteY,
                chao.largura,
                chao.altura,
                (chao.x + chao.largura),
                chao.y,
                chao.largura,
                chao.altura
            );
        },
    
    };
    return chao;
}

function fazColisao(flappyBird,chao){
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if(flappyBirdY >= chaoY ){
        return true;
    }
    return false;
}

function criarFlappyBird(){
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4,
        gravidade: 0.25,
        velocidade: 0,
        
        pula(){
            flappyBird.velocidade = -flappyBird.pulo;
        },

        atualiza(){
            if(fazColisao(flappyBird,globais.chao)){

                hit.play();

                
                mudaParaTela(Telas.GAME_OVER);
  
                return;
            }
        
    
            flappyBird.velocidade += flappyBird.gravidade;
            flappyBird.y += flappyBird.velocidade; 
        },

        movimentos: [
            {spriteX: 0, spriteY: 0}, //asa cima
            {spriteX: 0, spriteY: 26}, //asa meio
            {spriteX: 0, spriteY: 52}, //asa baixo
            {spriteX: 0, spriteY: 26}, //asa meio
        ],
        
        frameAtual: 0,
        atualizaFrameAtual(){
            const intervaloFrames = 10;
            const passouIntervalo = frames % intervaloFrames == 0;

            if(passouIntervalo){
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao
            }
        },

        desenha(){
            flappyBird.atualizaFrameAtual();
            const {spriteX , spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
            contexto.drawImage(
                sprites,
                spriteX, spriteY,
                flappyBird.largura,
                flappyBird.altura,
                flappyBird.x,
                flappyBird.y,
                flappyBird.largura,
                flappyBird.altura
            );    
        }
    }
    return flappyBird;
}

function criaCanos(){
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,

        desenha(){
            
            canos.pares.forEach(function(par){
                const yRandom = par.y;
                const espaçoEntreCanos = 90;

                //[Cano Ceu]
                const canoCeuX = par.x;
                const canoCeuY = yRandom;

                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX,canos.ceu.spriteY,
                    canos.largura,canos.altura,
                    canoCeuX,canoCeuY,
                    canos.largura,canos.altura,
                )
    
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espaçoEntreCanos + yRandom;
                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX,canos.chao.spriteY,
                    canos.largura,canos.altura,
                    canoChaoX,canoChaoY,
                    canos.largura,canos.altura,
                )

                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                }
            })

        },

        temColisaoFlappyBird(par){

            const cabecaFlappy = globais.flappyBird.y;
            const corpoFlappyBird = globais.flappyBird.x;
            const peFlappy = globais.flappyBird.y + globais.flappyBird.altura;
            if(globais.flappyBird.x + globais.flappyBird.largura - 10 >= par.x ){
                
                if(cabecaFlappy <= par.canoCeu.y){
                    if(corpoFlappyBird <= par.canoCeu.x + this.largura){
                        morreu.play();
                        return true
                    }
                }

                if(peFlappy >= par.canoChao.y){
                    if(corpoFlappyBird <= par.canoChao.x + this.largura){
                        morreu.play();
                        return true
                    }
                }
            }

            return false;
        },

        pares: [],
        atualiza(){
            const passou100Frames = frames % 100 === 0;
            if(passou100Frames){
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                });
            }

            canos.pares.forEach(function(par){
                par.x = par.x - 2;

                if(canos.temColisaoFlappyBird(par)){
                    hit.play();
                    mudaParaTela(Telas.GAME_OVER);
                }

                if(par.x + canos.largura <= 0 ){
                    canos.pares.shift();
                }
            });

        }
    }
    return canos;
}

function criaPlacar(){
    const placar = {

        pontuacao: 0,
        
        desenha(){

            contexto.font = '50px "VT323"';
            contexto.textAlign = 'right';
            contexto.fillStyle = 'white';
            contexto.fillText(`${placar.pontuacao}`,canvas.width-10,45);
        },

        atualiza(){

            const intervaloFrames = 10;
            const passouIntervalo = frames % intervaloFrames === 0;

            if(passouIntervalo){
                placar.pontuacao += 1;
            }
        },

    }

    return placar;
}


/////////////
/// TELAS ///
/////////////
const globais = {};
let telaAtiva = {};

function mudaParaTela(novaTela){
    telaAtiva = novaTela;

    if(telaAtiva.inicializa()){
        inicializa();
    }
}

const Telas = {
    INICIO:{
        inicializa(){
            globais.flappyBird = criarFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },

        desenha(){
            planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            telaDeInicio.desenha();
        },

        click(){
            mudaParaTela(Telas.JOGO);
        },
        atualiza(){
            globais.chao.atualiza();

        }
    }
};

Telas.JOGO = {
    inicializa(){
        //musica.play();
        
        globais.placar = criaPlacar();
    },
    desenha(){
        planoDeFundo.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
        globais.placar.desenha();
    },

    click(){
        globais.flappyBird.pula();
    },

    atualiza(){
        globais.canos.atualiza();
        globais.flappyBird.atualiza();
        globais.chao.atualiza();
        globais.placar.atualiza();
        
    }
};

Telas.GAME_OVER = {
    inicializa(){
        musica.remove(true);
    },

    desenha(){
        mensagemGameOver.desenha();
    },

    atualiza(){

    },
    click(){
        mudaParaTela(Telas.INICIO);
    }
};


function loop(){

    telaAtiva.desenha();
    telaAtiva.atualiza();
    frames += 1;
    requestAnimationFrame(loop);
}

window.addEventListener('click',function(){
    if(telaAtiva.click){
        telaAtiva.click();
    }
});

mudaParaTela(Telas.INICIO);
loop();
// import '~bootstrap';
import './style.scss';
import game from './utils/game';

const canvas = document.createElement('canvas');
document.body.append(canvas);

game.init(canvas);

// Importa o módulo crypto explicitamente
import * as crypto from 'crypto';

// Adiciona o módulo crypto ao objeto global
// @ts-expect-error crypto is not defined
global.crypto = crypto;

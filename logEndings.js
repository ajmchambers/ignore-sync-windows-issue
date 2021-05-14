const fs = require('fs');
const path = require('path');

const AUTO = {
  input: '.autoignore-sync',
  output: '.autoignore'
}

const CRLF = {
  input: '.crlfignore-sync',
  output: '.crlfignore'
}

const LF = {
  input: '.lfignore-sync',
  output: '.lfignore'
}

function chkcrlf(text){
	return {
		lf: /\n/.test(text.replace(/\r\n/g, '')),
		crlf: /\r\n/.test(text)
	};
}

function logEndings(fileInfo) {
  let result = {
    input: {
      file: fileInfo.input
    },
    output: {
      file: fileInfo.output
    }
  };

  try {
    const inputPath = path.resolve(fileInfo.input)
    const inputContents = fs.readFileSync(inputPath, 'utf-8');
    const inputEndings = chkcrlf(inputContents);
    result = {
      ...result,
      input: {
        ...result.input,
        ...inputEndings
      }
    };
  } catch (error) {
    result = {
      ...result,
      input: {
        ...result.input,
        error: error.message
      }
    };
  }

  try {
    const outputPath = path.resolve(fileInfo.output)
    const outputContents = fs.readFileSync(outputPath, 'utf-8');
    const outputEndings = chkcrlf(outputContents);
    result = {
      ...result,
      output: {
        ...result.output,
        ...outputEndings
      }
    };
  } catch (error) {
    result = {
      ...result,
      output: {
        ...result.output,
        error: error.message
      }
    };
  }
  
  if (!result.input.error && !result.output.error) {
    result = {
      ...result,
      changed: result.input.lf !== result.output.lf
        || result.input.clrf !== result.output.clrf
    }
  }
    
  return result;
}

const results = [AUTO, CRLF, LF].map(logEndings);

console.log(results);
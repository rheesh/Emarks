import regexValidator from './webLinkValidator';

const writeUrlTextHere = 'https://example.com';
const writeTextHereString = 'Write some text here';

const replaceBetween = (text, selection, what) =>
    text.substring(0, selection.start) + what + text.substring(selection.end);

const isStringWebLink = (text) => {
    const pattern = regexValidator;
    return pattern.test(text);
};

const apply = ( setState, text, startPos, endPos, timeOut=25 ) => {
    const extra = {
        selection: {
            start: startPos,
            end: endPos,
        },
    };
    setState({text: text}, () => {
        setTimeout(() => {
            setState({...extra});
        }, timeOut);
    });
};

export const applyWrapFormat = ({ getState, item, setState }) => {
    const {text, selection} = getState();
    const newText = replaceBetween(
        text,
        selection,
        item.wrapper.concat(text.substring(selection.start, selection.end), item.wrapper),
    );
    let newPosition;
    if (selection.start === selection.end) {
        newPosition = selection.end + item.wrapper.length;
    } else {
        newPosition = selection.end + item.wrapper.length * 2;
    }
    apply( setState, newText, newPosition, newPosition);
};

export const applyWrapFormatNewLines = ({ getState, item, setState }) => {
  const { text, selection } = getState();
  let newPosition, newText;
  let what = item.wrapper.concat( '\n', text.substring(selection.start, selection.end), '\n', item.wrapper, '\n', );
  if (selection.start === selection.end) {
    newPosition = selection.end + item.wrapper.length + 2; // +2 For two new lines
    newText = replaceBetween( text, selection, '\n' + what );
  } else {
    newPosition = selection.end + item.wrapper.length * 2 + 3; // +3 For three new lines
    newText = replaceBetween( text, selection, what );
  }
  apply(setState, newText, newPosition, newPosition);
};

export const applyImageLinkFormat = ({ getState, item, setState }) => {
    const { selection, text, imageKit } = getState();
    if(imageKit){
        imageKit.customEditorBtn = [{
            callback: (picture) => {
                let newText;
                let startPos, endPos;
                const selected = text.substring(selection.start, selection.end);
                const imgSize = `{${picture.width}x${picture.height}}`;
                const source = picture.source.startsWith('file:///') ? picture.source.substr(7) : picture.source;
                if (selection.start !== selection.end) {
                    newText = replaceBetween(text, selection, `![${imgSize}${selected}](${source})`);
                    startPos = selection.end + 3 + picture.source.length;
                    endPos = startPos;
                } else {
                    newText = replaceBetween(text, selection, `![${imgSize}](${source})`);
                    startPos = selection.start + 1;
                    endPos = selection.start + 1 + writeTextHereString.length;
                }
                apply(setState, newText, startPos, endPos);
                imageKit.closeModal();
            },
            bordered: true,
            icon: {
                name: 'format-wrap-inline',
                type: 'MaterialCommunityIcons',
            },
            text: { label: 'Insert' },
        }];
        imageKit.openModal();
    }
};

export const applyWebLinkFormat = ({ getState, item, setState }) => {
    const { selection, text } = getState();
    let newText;
    let startPos, endPos;
    const selectedText = text.substring(selection.start, selection.end);
    if (selection.start !== selection.end) {
        if (isStringWebLink(selectedText)) {
            newText = replaceBetween(text, selection, `[${writeTextHereString}](${selectedText})`);
            startPos = selection.start + 1;
            endPos = selection.start + 1 + writeTextHereString.length;
        } else {
          newText = replaceBetween(text, selection, `[${selectedText}](${writeUrlTextHere})`);
          startPos = selection.end + 3;
          endPos = selection.end + 3 + writeUrlTextHere.length;
        }
    } else {
        newText = replaceBetween(text, selection, `[${writeTextHereString}](${writeUrlTextHere})`);
        startPos = selection.start + 1;
        endPos = selection.start + 1 + writeTextHereString.length;
    }
    apply(setState, newText, startPos, endPos);
};

export const applyListFormat = ({ getState, item, setState }) => {
    let { text } = getState();
    const { selection } = getState();
    text = text || '';
    let newText, startPos, endPos;
    let what = item.prefix;
    const len = item.prefix.length;
    if (selection.start !== selection.end) {
        what += ` ${text.substring(selection.start, selection.end)}\n`;
        newText = replaceBetween( text, selection, what );
        startPos = selection.end + len + 1;
        endPos = selection.end + len + 1;
    } else if ( text.substring(selection.end - 1, selection.end) === '\n' ) {
        newText = replaceBetween(text, selection, what);
        startPos = selection.start + len;
        endPos = selection.start + len;
    } else {
        newText = replaceBetween(text, selection, `\n${what} `);
        startPos = selection.start + len + 1;
        endPos = selection.start + len + 1;
    }
    apply(setState, newText, startPos, endPos, 300)
};

export const applyHrFormat = ({ getState, item, setState }) => {
    const { text, selection } = getState();
    let newPosition=0, newText;
    let what = item.wrapper;
    if (selection.start > 0 && text[selection.start-1] !== '\n'){
        what = '\n\n' + what;
        newPosition += 2;
    } else if (selection.start > 1 && text[selection.start-2] !== '\n'){
        what = '\n' + what;
        newPosition++;
    }
    if (selection.end < text.length && text[selection.end] !== '\n'){
        what = what + '\n\n';
        newPosition += 2;
    } else if (selection.end+1 < text.length && text[selection.end+1] !== '\n'){
        what = what + '\n';
        newPosition++;
    }

    newPosition += selection.start + item.wrapper.length + 1; // +2 For two new lines
    newText = replaceBetween( text, selection, what );
    apply(setState, newText, newPosition, newPosition);
};

const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');
const outputPath = path.join(__dirname, 'output.json');

/**
 * Разбор исходного файла в формате:
 * # Page 1
 * (текст, может быть в несколько абзацев)
 * ? вопрос 1
 * ? вопрос 2
 */
function parseInput(text) {
  const blocks = text
    .split(/^# /gm) // Разделяем на блоки по строкам "# "
    .filter(Boolean); // Убираем пустые блоки

  const result = blocks.map((block, index) => {
    const lines = block.trim().split('\n').map(line => line.trimEnd());
    const titleLine = lines.shift(); // Например: "Page 1"

    // Разделим текст и вопросы
    const textLines = [];
    const questionLines = [];

    let isQuestion = false;
    for (const line of lines) {
      if (line.startsWith('?')) {
        isQuestion = true;
      }
      if (isQuestion) {
        questionLines.push(line);
      } else {
        textLines.push(line);
      }
    }

    // Собираем абзацы текста, разделяя их по пустым строкам
    const paragraphs = [];
    let currentParagraph = [];

    for (const line of textLines) {
      if (line === '') {
        if (currentParagraph.length) {
          paragraphs.push(currentParagraph.join(' '));
          currentParagraph = [];
        }
      } else {
        currentParagraph.push(line);
      }
    }

    if (currentParagraph.length) {
      paragraphs.push(currentParagraph.join(' '));
    }

    // Объединяем абзацы с разделителем \n\n
    const textBlock = paragraphs.join('\n');

    // Обрабатываем вопросы
    const questions = questionLines.map((line, qIndex) => {
      const questionText = line.replace(/^\?\s*/, '');
      return {
        id: qIndex + 1,
        text: questionText,
        audio: `/audio/${index + 1}q${qIndex + 1}.mp3`
      };
    });

    return {
      id: index + 1,
      textBlock,
      questions
    };
  });

  return result;
}

function main() {
  try {
    const inputText = fs.readFileSync(inputPath, 'utf-8');
    const jsonData = parseInput(inputText);
    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2), 'utf-8');
    console.log(`✅ JSON успешно создан: ${outputPath}`);
  } catch (err) {
    console.error('❌ Ошибка при создании JSON:', err);
  }
}

main();

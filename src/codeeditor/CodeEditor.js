import React, { useState } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/mode-swift';
import 'ace-builds/src-noconflict/mode-scala';
import 'ace-builds/src-noconflict/mode-ruby';
import 'ace-builds/src-noconflict/mode-dart';

import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/theme-solarized_light';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-github_dark';
import 'ace-builds/src-noconflict/theme-chrome';

import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';

import './style.css';
import UserInput from '../userinput/UserInput';

const CodeEditor = () => {
	const defaultCode = {
		java: `public class Main {
      public static void main(String[] args) {
        System.out.println("Hello, World!");
      }
    }`,
		c_cpp: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
		python: `print("Hello, World!")`,
		golang: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
		swift: `import Foundation
print("Hello, World!")`,
		scala: `object Main extends App {
    println("Hello, World!")
}`,
		ruby: `puts "Hello, World!"`,
		dart: `void main() {
    print('Hello, World!');
}`,
	};

	const [code, setCode] = useState(defaultCode.java);
	const [output, setOutput] = useState('');
	const [selectedLanguage, setSelectedLanguage] = useState('java');
	const [selectedTheme, setSelectedTheme] = useState('github');
	const [isLoading, setIsLoading] = useState(false);
	const [userInput, setUserInput] = useState('');

	const requiresUserInput = () => {
		const inputPatterns = {
			java: /Scanner\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*new\s*Scanner\(System\.in\)/,
			python: /input\(/,
			c_cpp: /scanf\(/,
			golang: /fmt\.Scan/,
		};

		return inputPatterns[selectedLanguage] && inputPatterns[selectedLanguage].test(code);
	};

	const handleRunCode = async () => {
		if (requiresUserInput() && userInput === "") {
			setOutput('Waiting for user input...');
			return;
		}

		setIsLoading(true);
		try {
			const response = await axios.post('http://localhost:3001/run-code', {
				code,
				language: selectedLanguage,
				input: requiresUserInput() ? userInput : '',
			});
			setOutput(response.data.output);
			setUserInput('');
		} catch (error) {
			console.error('Error running code:', error);
			setOutput('Error occurred while running code.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleLanguageChange = (event) => {
		setSelectedLanguage(event.target.value);
		setCode(defaultCode[event.target.value]);
	};

	const handleThemeChange = (event) => {
		setSelectedTheme(event.target.value);
	};

	const handleUserInput = (inputValue) => {
		setUserInput(inputValue);
	};

	return (
		<div className="code-editor-container">
			<div className="container">
				<div className="run-code-container">
					<button className="run-button" onClick={handleRunCode}>
						Run Code
					</button>
					{isLoading && <div className="loader"></div>}
				</div>
				<div className="language-selector">
					<select value={selectedLanguage} onChange={handleLanguageChange}>
						<option value="java">Java</option>
						<option value="c_cpp">C++</option>
						<option value="python">Python</option>
						<option value="golang">Go</option>
						<option value="swift">Swift</option>
						<option value="scala">Scala</option>
						<option value="ruby">Ruby</option>
						<option value="dart">Dart</option>
					</select>
				</div>
				<div className="language-selector">
					<select value={selectedTheme} onChange={handleThemeChange}>
						<option value="github">GitHub</option>
						<option value="monokai">Monokai</option>
						<option value="xcode">Xcode</option>
						<option value="solarized_light">Solarized light</option>
						<option value="solarized_dark">Solarized dark</option>
						<option value="github_dark">GitHub dark</option>
						<option value="chrome">Chrome</option>
					</select>
				</div>
			</div>

			<div className="container">
				<div className="editor-container">
					<AceEditor
						mode={selectedLanguage}
						theme={selectedTheme}
						value={code}
						onChange={setCode}
						name="code-editor"
						editorProps={{ $blockScrolling: Infinity }}
						width="100%"
						height="500px"
						showPrintMargin={false}
						showGutter={true}
						fontSize={14}
						setOptions={{
							enableBasicAutocompletion: true,
							enableLiveAutocompletion: true,
							enableSnippets: true,
							showLineNumbers: true,
							tabSize: 4,
						}}
					/>
				</div>

				<div>
					<UserInput onInput={handleUserInput} />
				</div>
			</div>

			<div className="output-container">
				<h3>Output:</h3>
				<pre className="content">{output}</pre>
			</div>
		</div>
	);
};

export default CodeEditor;

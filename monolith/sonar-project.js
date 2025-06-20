const scanner = require('sonarqube-scanner').default;

scanner(
  {
    serverUrl: 'http://localhost:9000',
    token: 'sqp_93c3f6a4ac527a83b1ccb315714abf4607df5fe3', 
    options: {
      'sonar.projectKey': 'atletica-monolith',
      'sonar.projectName': 'Atlética Monolith',
      'sonar.projectVersion': '1.0.0',
      'sonar.sources': 'src',
      'sonar.tests': 'src/**/__tests__',
      'sonar.test.inclusions': '**/*.spec.ts,**/*.test.ts',
      'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.sourceEncoding': 'UTF-8',
      'sonar.exclusions': 'node_modules/**,**/node_modules/**,**/*.spec.ts,**/*.test.ts'
    }
  },
  () => process.exit()
);
const scanner = require('sonarqube-scanner');

scanner(
  {
    serverUrl: 'http://localhost:9000',
    options: {
      'sonar.projectKey': 'atletica-ticket-service',
      'sonar.projectName': 'Atlética Ticket Service',
      'sonar.projectVersion': '1.0.0',
      'sonar.sources': 'src',
      'sonar.tests': '__tests__,src/**/__tests__',
      'sonar.test.inclusions': '**/*.spec.ts,**/*.test.ts',
      'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.sourceEncoding': 'UTF-8',
      'sonar.exclusions': 'node_modules/**,**/node_modules/**,**/*.spec.ts,**/*.test.ts'
    }
  },
  () => process.exit()
);
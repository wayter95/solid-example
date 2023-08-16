# 🚀 Explorando Princípios SOLID com TypeScript e Node.js! 🌟

Apesar de não ser muito ativo em publicações no LinkedIn, decidi iniciar esse compartilhamento, especialmente porque estou mergulhando cada vez mais nos estudos de arquitetura de software. Afinal, para construir sistemas sólidos, a clareza no código é essencial. Hoje, gostaria de dividir minha perspectiva em relação aos princípios SOLID, em conexão com o desenvolvimento em Node.js e o uso do TypeScript. 💡

🔍 Para quem não está familiarizado, SOLID é um acrônimo que representa cinco princípios fundamentais para escrever código limpo, escalável e de fácil manutenção. Vamos dar uma olhada rápida:

### S - Princípio da Responsabilidade Única (SRP - Single Responsibility Principle):

Cada classe deve ter uma única razão para mudar. Isso nos ajuda a manter nosso código coeso e facilita a manutenção.

```ts
import { v4 as uuidv4 } from 'uuid';

abstract class BaseEntity<T> {
  protected readonly _id: string;
  public readonly props: T;

  get id() {
    return this._id;
  }

  constructor(props: T, id?: string) {
    this._id = id || uuidv4();
    this.props = props;
  }
}

export {BaseEntity}
```

```ts
import { BaseEntity } from "./base.entity";

interface UserProps {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

class User extends BaseEntity<UserProps> {
  get name() {
   return this.props.name
  }
  
  get email() {
   return this.props.email
  }
  
  get password() {
   return this.props.password
  }
  
  get createdAt() {
   return this.props.createdAt
  }

  constructor(props: UserProps, id?: string) {
    super(props, id);
  }
}

export { User, UserProps}
```
- A classe BaseEntity tem a responsabilidade única de cuidar da estrutura básica da entidade, incluindo a geração de IDs únicos e a preservação das propriedades.

- A classe User tem a responsabilidade única de lidar com as propriedades específicas de um usuário, como nome, email, senha e data de criação.

### O - Princípio do Aberto/Fechado  (OCP - Open/Closed Principle):
O código deve estar aberto para extensões, mas fechado para modificações. Isso incentiva a adição de novos recursos sem alterar o código existente.

```ts
import { User } from "../entities/user.entity";

abstract class UserRepository {
  abstract create(user: User): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
}

export {UserRepository}
```

```ts
import { User } from "../entities/user.entity";
import { UserRepository } from "./user.repository";

class ArrayUserRepository extends UserRepository {
  private users: User[] = [];

  async create(user: User): Promise<User> {
   this.users.push(user);

   return user
  }
  
  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((item) => item.email === email)

    if(!user) {
      return null;
    }

    return user;
  }
}

export { ArrayUserRepository }
```

- A classe UserRepository define os métodos save e getByEmail que um repositório de usuário deve ter.

- A classe ArrayUserRepository extend a classe UserRepository para fornecer funcionalidades específicas de salvamento e busca em um array, respectivamente.

Dessa forma, você pode adicionar novos tipos de repositórios sem modificar o código existente. Se quiser adicionar um repositório para um novo tipo de armazenamento, basta criar uma nova classe que implementa UserRepository.

### L - Princípio da Substituição de Liskov (LSP - Liskov Substitution Principle):

As classes derivadas devem ser substituíveis por suas classes base sem afetar a integridade do programa. Isso garante a consistência do comportamento.

```ts
import { User, UserProps } from './user.entity';

interface import { User, UserProps } from './user.entity';

interface AdminUserProps extends UserProps {
  role: string;
}

class AdminUser extends User {
  private readonly _role: string;

  get role(): string {
    return this._role
  }

  constructor(props: AdminUserProps, id?: string) {
    super(props, id);
    this._role = props.role;
  }
}

export { AdminUser }
```
- A classe AdminUser herda as caracteristicas da classe User e adiciona a propriedade role assim a funcionalidade esperada é mantida.

Isso demonstra como a substituição de User por AdminUser segue o Princípio da Substituição de Liskov, permitindo que a hierarquia de classes seja usada de forma consistente em diferentes contextos.

### I - Princípio da Segregação de Interface: (ISP - Interface Segregation Principle):

Clientes não devem ser forçados a depender de interfaces que não utilizam. Interfaces específicas são melhores do que uma interface genérica.

```ts
import { User } from "../../entities/user.entity";

interface ISignUpUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

abstract class ISignUpUseCase {
  abstract handle(request: ISignUpUseCaseRequest): Promise<User>
}

export {ISignUpUseCase, ISignUpUseCaseRequest}
```

```ts
import { User } from "../../entities/user.entity";
import { ArrayUserRepository } from "../../repositories/array-user.repository";
import { ISignUpUseCase, ISignUpUseCaseRequest } from "./interface-sign-up.use-case";

class SignUpUseCase implements ISignUpUseCase {
  async handle(request: ISignUpUseCaseRequest): Promise<User> {
    const userRepository = new ArrayUserRepository();

    const userExist = await userRepository.findByEmail(request.email);

    if (userExist) {
      throw new Error("User already exists.");
    }

    const user = new User(request);

    await userRepository.create(user);

    return user;
  }
}

export { SignUpUseCase };
```
- Na classe ISignUpUseCase definimos uma interface específica para o caso de uso SignUpUseCase. Isso evita a dependência de métodos não utilizados e torna nossa interface mais coesa e mais facil de se entender.

### D - Princípio da Inversão de Dependência (DIP - Dependency Inversion Principle):
Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações. Além disso, detalhes devem depender de abstrações, não o contrário.

```ts
import { User } from "../../entities/user.entity";
import { UserRepository } from "../../repositories/user.repository";
import { ISignUpUseCase, ISignUpUseCaseRequest } from "./interface-sign-up.use-case";


class SignUpUseCase implements ISignUpUseCase {
  constructor (private readonly userRepository: UserRepository) {}

  async handle(request: ISignUpUseCaseRequest): Promise<User> {
    const userExist = await this.userRepository.findByEmail(request.email);

    if(userExist) {
      throw new Error("User already exists.")
    }

    const user = new User(request)
    
    await this.userRepository.create(user);

    return user;
  }
}

export {SignUpUseCase}
```
- Na classe SignUpUseCase, implementamos o princípio da Inversão de Dependência (DIP). Ao injetar a interface UserRepository via construtor, garantimos que nossos módulos de alto nível não dependam de detalhes de implementação.

Ao seguir o DIP e injetar abstrações, estamos construindo um código mais flexível, extensível e de fácil manutenção. Isso nos permite adaptar nosso sistema a mudanças e evoluções sem causar interrupções ou reescrever grandes partes do código.

#### 👨‍💻 Ao aplicar esses princípios ao desenvolvimento em Node.js com TypeScript, conseguimos criar aplicações mais flexíveis, escaláveis e fáceis de se manter. A tipagem forte do TypeScript também ajuda a identificar problemas em tempo de desenvolvimento, reduzindo erros e aumentando a confiança no código.

Compartilhe suas opiniões nos comentários 🚀

#DesenvolvimentoWeb #Nodejs #TypeScript #SOLIDPrinciples #AprendizadoConstante


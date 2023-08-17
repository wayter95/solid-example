# 🚀 Explorando Princípios SOLID com TypeScript e Node.js! 🌟

Em um mundo de desenvolvimento ágil, é fácil perder-se em meio ao código complexo e intricado. Ao adentrar mais nos estudos de arquitetura de software, percebi que o segredo para evitar essa armadilha reside na simplicidade e clareza do código. E é exatamente aqui que os princípios SOLID entram em jogo. Hoje, gostaria de compartilhar minha jornada explorando esses princípios com TypeScript e Node.js.

🔍 Para os novatos, SOLID é um acrônimo que descreve cinco princípios fundamentais para criar códigos limpos, escaláveis e de fácil manutenção.

#### Acompanhe-me nesta exploração:

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

É vital evitar sobrecarregar uma classe ou entidade com responsabilidades desnecessárias. Esse princípio destaca a importância de manter as interfaces limpas e diretas ao ponto.

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
O núcleo deste princípio é a desacoplagem. Evitando dependências rígidas, mantemos nosso código flexível e adaptável às mudanças futuras.

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

#### 👨‍💻 Conclusão:
Ao incorporar os princípios SOLID no desenvolvimento com Node.js e TypeScript, não apenas fortalecemos a base arquitetural de nossas aplicações, mas também nos preparamos para os desafios futuros. E com o suporte de tipagem do TypeScript, temos uma ferramenta adicional para nos ajudar a identificar e corrigir problemas mais cedo no ciclo de desenvolvimento. Esse é o caminho para um código robusto e eficiente!

🔗 Ler no medium: 

https://medium.com/@wayter.paulo.95/explorando-princ%C3%ADpios-solid-com-typescript-e-node-js-7ea74124bacd
num_features = 2;

Y = [0 1 1 0 1 0 0 0 0 1 0 0 0 0 1 1 1 1 0 0 0 0 1 0 1 1 1 0 1 0 1 0 1 0 0 1 0 1 0 1 0 0 0 1 0 1 1 0 0 0 1 1 0 0 1 1 1 0 0 0 ; 0 1 1 1 0 1 1 1 1 0 1 0 0 1 1 0 1 0 0 1 1 0 1 1 1 1 1 1 0 1 1 0 0 0 1 1 1 1 1 1 1 0 0 0 0 1 0 1 0 1 1 0 0 1 1 0 1 1 1 1 ; 0 1 1 1 0 1 0 0 0 0 1 1 0 1 1 1 0 1 0 0 1 0 1 1 1 1 1 1 1 1 1 0 1 0 1 0 1 1 0 1 0 1 0 1 0 1 1 1 0 1 1 1 0 0 1 0 1 1 1 1 ; 0 1 1 0 0 1 0 1 0 1 0 1 1 0 1 0 0 1 1 1 1 0 1 1 1 1 0 1 1 0 1 0 1 1 1 0 0 1 0 0 1 0 1 0 0 1 0 1 1 1 1 1 1 1 1 0 1 1 1 1 ; 0 1 1 0 0 1 1 0 1 0 1 0 1 1 0 1 1 1 1 1 1 1 1 1 1 1 1 0 1 0 1 1 0 1 1 1 1 1 0 1 1 1 0 0 0 1 0 1 1 1 1 1 1 0 1 1 1 1 1 1 ; 1 1 1 0 1 1 0 1 1 1 1 1 1 1 1 1 0 1 1 0 1 1 0 1 1 1 0 1 1 0 1 1 1 1 1 1 0 1 0 1 1 0 0 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 ; 1 1 1 1 1 1 1 1 1 0 1 1 1 1 1 1 0 1 0 1 1 1 1 1 0 1 0 1 1 0 1 1 0 0 1 1 1 1 1 1 1 1 0 1 1 1 0 1 1 1 1 1 1 1 1 1 1 1 1 1 ; 1 1 1 1 0 1 1 0 0 1 1 1 1 1 1 1 1 1 0 1 1 1 0 1 1 1 1 1 1 0 1 1 1 1 1 0 1 1 1 1 1 1 1 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 ];

Y = Y';


%Balardin
%Perez
%Finamore
%Blanca
%Vitor
%Colombo
%Fer
%Damke


%	Todos responderam a todas as questões
R = ones(size(Y));

Theta = randn(size(Y,2), num_features);
X = randn(size(Y,1), num_features);


num_users = size(Y,2);
num_questions = size(Y,1);

initial_parameters = [X(:); Theta(:)];

% Set options for fmincg
options = optimset('GradObj', 'on', 'MaxIter', 1000);

% Set Regularization
lambda = 0.4;

[theta fX] = fmincg (@(t)(cofiCostFunc(t, Y, R, num_users, num_questions, num_features, lambda)), initial_parameters, options);

% Unfold the returned theta back into U and W
X = reshape(theta(1:num_questions*num_features), num_questions, num_features);
Theta = reshape(theta(num_questions*num_features+1:end), num_users, num_features);

X;
Theta;


threshold = 0:0.01:1;
for i=1:length(threshold)
	precision(i) = sum(sum((sigmoid(X*Theta') >= threshold(i))==Y)) / (size(Y)(1) * size(Y)(2));
end

plot(threshold,precision);
% 


save questoesProva1.mat X Theta;
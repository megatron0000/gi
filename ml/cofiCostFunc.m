function [J, grad] = cofiCostFunc(params, Y, R, num_users, num_questions, ...
                                  num_features, lambda)
%COFICOSTFUNC Collaborative filtering cost function
%   [J, grad] = COFICOSTFUNC(params, Y, R, num_users, num_questions, ...
%   num_features, lambda) returns the cost and gradient for the
%   collaborative filtering problem.
%

% Unfold the U and W matrices from params
X = reshape(params(1:num_questions*num_features), num_questions, num_features);
Theta = reshape(params(num_questions*num_features+1:end), ...
                num_users, num_features);

            
% You need to return the following values correctly
J = 0;
X_grad = zeros(size(X));
Theta_grad = zeros(size(Theta));

% ====================== YOUR CODE HERE ======================
% Instructions: Compute the cost function and gradient for collaborative
%               filtering. Concretely, you should first implement the cost
%               function (without regularization) and make sure it is
%               matches our costs. After that, you should implement the 
%               gradient and use the checkCostFunction routine to check
%               that the gradient is correct. Finally, you should implement
%               regularization.
%
% Notes: X - num_questions  x num_features matrix of question features
%        Theta - num_users  x num_features matrix of user features
%        Y - num_questions x num_users matrix of user ratings of questions
%        R - num_questions x num_users matrix, where R(i, j) = 1 if the 
%            i-th question was rated by the j-th user
%
% You should set the following variables correctly:
%
%        X_grad - num_questions x num_features matrix, containing the 
%                 partial derivatives w.r.t. to each element of X
%        Theta_grad - num_users x num_features matrix, containing the 
%                     partial derivatives w.r.t. to each element of Theta
%



% Versão linear
% -----------------------------------------------------------
% 
% J = (1/2) * sum(sum((X*Theta' .* R - Y .* R) .* (X*Theta' .* R - Y .* R ))) + (lambda/2) * (sum(sum(Theta .* Theta)) +  sum(sum(X .* X)));

% errorMatrix = X*Theta' .* R - Y .* R;

% X_grad = errorMatrix * Theta + lambda * X;
% Theta_grad = errorMatrix' * X + lambda * Theta;
% -----------------------------------------------------------



% Versão sigmoide
% -----------------------------------------------------------
% 
J = (-1) * sum(sum( Y .* log(sigmoid(X * Theta')) .* R  +  (1-Y) .* log(1 -  sigmoid((X * Theta'))) .* R  )) + (lambda/2) * (sum(sum(Theta .* Theta)) +  sum(sum(X .* X)));

errorMatrix = sigmoid(X*Theta') .* R - Y .* R; 

X_grad = errorMatrix * Theta + lambda * X;
Theta_grad = errorMatrix' * X + lambda * Theta;

%	Fim da versão sigmoide
% -----------------------------------------------------------









% =============================================================

grad = [X_grad(:); Theta_grad(:)];

end
